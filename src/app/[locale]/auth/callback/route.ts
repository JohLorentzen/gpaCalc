import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

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
  
  // In production, always redirect to the configured domain or snittkalk.no as default
  if (process.env.NODE_ENV !== 'development') {
    if (process.env.NEXT_PUBLIC_SITE_DOMAIN === 'unigpacalc.com') {
      redirectOrigin = 'https://unigpacalc.com';
    } else {
      // Default to snittkalk.no
      redirectOrigin = 'https://snittkalk.no';
    }
    console.log(`Overriding origin from ${origin} to ${redirectOrigin} for production redirect`);
  }

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      console.log(`Successful auth callback, redirecting to: ${redirectOrigin}${next}`);
      return NextResponse.redirect(`${redirectOrigin}${next}`);
    } else {
      console.error('Error exchanging code for session:', error);
    }
  }

  // return the user to an error page with instructions
  console.error('Error in auth callback:', 'No code or error exchanging code');
  return NextResponse.redirect(`${redirectOrigin}/${locale}/auth/auth-code-error`);
} 