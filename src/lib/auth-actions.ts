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

  // Construct the redirectTo URL, ensuring it's an absolute URL
  // If NEXT_PUBLIC_SITE_URL is not set, this might need adjustment
  // or you might need to ensure it's available.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // Fallback for local dev
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
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
