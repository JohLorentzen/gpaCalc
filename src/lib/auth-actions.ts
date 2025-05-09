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

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: `${firstName + " " + lastName}`,
        email: formData.get("email") as string,
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
  // In a server action, we don't have direct access to the request object
  // This is a workaround that works in most deployments
  try {
    // In Next.js, we can use headers() to get request info, but it needs to be in the proper context
    // This is a placeholder for your implementation
    
    // For development and testing, handle multiple possible hosts
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000';
    }
    
    // For production, you could implement logic to determine between your domains
    // Based on your deployment environment or configuration
    
    // Check if we're on snittkalk.no
    if (process.env.NEXT_PUBLIC_SITE_DOMAIN === 'snittkalk.no') {
      return 'https://snittkalk.no';
    }
    
    // Default to unigpacalc.com
    return 'https://unigpacalc.com';
  } catch (error) {
    console.error('Error getting request host:', error);
    return null;
  }
}
