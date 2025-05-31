import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  props: { params: { locale: string } }
) {
  // Get the locale safely without destructuring
  const locale = props.params?.locale;
  
  if (!locale) {
    return NextResponse.redirect(new URL('/en', request.url).toString());
  }
  
  // Parse the request URL
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || `/${locale}`; // Use locale safely

  // Determine the correct domain for the redirect
  let redirectOrigin = origin;
  
  // First check if we're in a preview environment
  if (process.env.NEXT_PUBLIC_PREVIEW_URL) {
    redirectOrigin = process.env.NEXT_PUBLIC_PREVIEW_URL;
    console.log(`Using preview URL for redirect: ${redirectOrigin}`);
  }
  // In production, always redirect to the configured domain or snittkalk.no as default
  else if (process.env.NODE_ENV !== 'development') {
    if (process.env.NEXT_PUBLIC_SITE_DOMAIN === 'unigpacalc.com') {
      redirectOrigin = 'https://unigpacalc.com';
    } else {
      // Default to snittkalk.no
      redirectOrigin = 'https://snittkalk.no';
    }
    console.log(`Overriding origin from ${origin} to ${redirectOrigin} for production redirect`);
  }

  if (code) {
    try {
      const cookieStore = cookies();
      const supabase = createClient();
      
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        console.log(`Successful auth callback, redirecting to: ${redirectOrigin}${next}`);
        
        // Create redirect response
        const redirectUrl = `${redirectOrigin}${next}`;
        const response = NextResponse.redirect(redirectUrl);
        
        // Copy all auth-related cookies to the redirect response
        const supabaseCookies = cookieStore.getAll();
        for (const cookie of supabaseCookies) {
          if (cookie.name.includes('supabase') || cookie.name.includes('auth')) {
            // Use same cookie settings but ensure it works cross-domain
            response.cookies.set({
              name: cookie.name,
              value: cookie.value,
              path: '/',
              secure: true,
              sameSite: 'lax',
              httpOnly: true,
              maxAge: 60 * 60 * 24 * 7, // 1 week
            });
          }
        }
        
        return response;
      } else {
        console.error('Error exchanging code for session:', error);
      }
    } catch (err) {
      console.error('Error in auth callback processing:', err);
    }
  }

  // return the user to an error page with instructions
  console.error('Error in auth callback:', 'No code or error exchanging code');
  return NextResponse.redirect(`${redirectOrigin}/${locale}/auth/auth-code-error`);
} 