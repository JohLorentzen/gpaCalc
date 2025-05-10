"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// Helper function to check if an email belongs to a deleted user
async function isDeletedUser(email: string) {
  const supabase = createClient();
  
  // Query profiles table to check if this email is marked as deleted
  const { data, error } = await supabase
    .from('profiles')
    .select('deleted')
    .eq('email', email)
    .eq('deleted', true)
    .maybeSingle();
  
  if (error) {
    console.error('Error checking if user is deleted:', error);
    return false;
  }
  
  return data !== null;
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const email = formData.get("email") as string;
  
  // Get locale from the form data or default to 'en'
  const locale = formData.get("locale") as string || 'en';
  
  // Check if email belongs to a deleted account
  const isDeleted = await isDeletedUser(email);
  if (isDeleted) {
    // Redirect to a page that informs the user their account was deleted
    // and they should contact support
    redirect(`/${locale}/account-deleted`);
  }
  
  const data = {
    email,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: `${firstName + " " + lastName}`,
        email,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signout(locale: string) {
  const supabase = createClient();
  console.log(`[AuthAction] Attempting to sign out user for locale: ${locale}`);
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("[AuthAction] Error signing out from Supabase:", error);
    return { success: false, error: error.message, locale };
  }
  
  console.log(`[AuthAction] Successfully signed out user for locale: ${locale}`);
  // Minimal revalidation - revalidate the specific locale's root. Client will handle redirect.
  revalidatePath(`/${locale}`, 'page'); // Revalidate just the page, not layout, to be more targeted.
  return { success: true, locale }; 
}

export async function signInWithGoogle(locale: string) {
  const supabase = createClient();

  // Get the current host from the request to determine which domain to use
  // This allows the callback to work with multiple domains
  const currentHost = getRequestHost();
  
  // If we can't determine the host, fallback to configured site URL or localhost
  const siteUrl = currentHost || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectTo = `${siteUrl}/${locale}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo: redirectTo, // Use the locale-specific redirect URL
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url);
}

export async function signInWithMicrosoft(locale: string) {
  const supabase = createClient();
  
  // Get the current host from the request to determine which domain to use
  const currentHost = getRequestHost();
  
  // If we can't determine the host, fallback to configured site URL or localhost
  const siteUrl = currentHost || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectTo = `${siteUrl}/${locale}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "azure", // Microsoft provider is typically 'azure' in Supabase
    options: {
      scopes: "email openid profile", // Common scopes for Microsoft
      redirectTo: redirectTo,
      queryParams: {
        // prompt: "consent", // Optional: force consent screen if needed
      },
    },
  });

  if (error) {
    console.error("Microsoft SignIn Error:", error);
    // Consider a more user-friendly error page or message
    redirect(`/${locale}/auth/auth-error?message=${encodeURIComponent(error.message)}`); 
  }

  if (data.url) {
    redirect(data.url);
  } else {
    // Handle the case where data.url is null, though it's unlikely for OAuth redirects
    console.error("Microsoft SignIn Error: No URL returned from Supabase");
    redirect(`/${locale}/auth/auth-error?message=Microsoft%20sign-in%20failed%20to%20initiate.`);
  }
}

// Helper function to get the current request host
function getRequestHost() {
  try {
    // Always use the configured site domain if available, regardless of environment
    if (process.env.NEXT_PUBLIC_SITE_DOMAIN) {
      if (process.env.NEXT_PUBLIC_SITE_DOMAIN === 'snittkalk.no') {
        console.log("Using snittkalk.no domain for auth redirect");
        return 'https://snittkalk.no';
      } else if (process.env.NEXT_PUBLIC_SITE_DOMAIN === 'unigpacalc.com') {
        console.log("Using unigpacalc.com domain for auth redirect");
        return 'https://unigpacalc.com';
      }
    }
    
    // If we're in development and no domain is set, use localhost
    if (process.env.NODE_ENV === 'development') {
      console.log("Using localhost for auth redirect");
      return 'http://localhost:3000';
    }
    
    // Default to snittkalk.no for production if no domain is specified
    console.log("Defaulting to snittkalk.no for auth redirect");
    return 'https://snittkalk.no';
  } catch (error) {
    console.error('Error getting request host:', error);
    return 'https://snittkalk.no'; // Default to snittkalk.no even if there's an error
  }
}
