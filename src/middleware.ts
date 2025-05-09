import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/utils/supabase/middleware';
import { locales, defaultLocale } from '@/i18n/routing';

// Create the internationalization middleware with specific configuration
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'never', // Change to 'never' to avoid the loop
});

export async function middleware(request: NextRequest) {
  // First handle authentication session
  const authResponse = await updateSession(request);
  
  // Then handle internationalization redirects
  const pathname = request.nextUrl.pathname;
  
  // Log request for debugging
  console.log(`Processing request for: ${pathname}`);
  
  // Skip internationalization middleware for API routes and static files
  if (
    pathname.startsWith('/api/') || 
    pathname.includes('.') ||
    pathname.startsWith('/_next/')
  ) {
    return authResponse;
  }
  
  // For the root path ("/"), always redirect to a locale
  if (pathname === '/') {
    // Get locale from cookie or use default
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    const targetLocale = cookieLocale && locales.includes(cookieLocale as any) 
      ? cookieLocale 
      : defaultLocale;
    
    console.log(`Redirecting root to locale: ${targetLocale}`);
    return NextResponse.redirect(new URL(`/${targetLocale}`, request.url));
  }
  
  // Check if we're already on a locale path to prevent redirect loops
  const pathnameLocale = pathname.split('/')[1];
  if (locales.includes(pathnameLocale as any)) {
    // We're already on a locale path, proceed with the request
    console.log(`Already on locale path: ${pathnameLocale}, proceeding`);
    return authResponse;
  }
  
  // For all other paths, let next-intl handle it
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};