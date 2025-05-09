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
  
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || `/${locale}`; // Use locale safely

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  console.error('Error in auth callback:', 'No code or error exchanging code');
  return NextResponse.redirect(`${origin}/${locale}/auth/auth-code-error`);
} 