import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Detect if we're in a preview environment
  const isPreview = !!process.env.NEXT_PUBLIC_PREVIEW_URL;
  
  // Create Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Modify cookie options for cross-domain compatibility in preview environments
          const cookieOptions = {
            ...options,
            // Ensure cookies work across domains in preview environments
            domain: isPreview ? undefined : options.domain,
            // Allow cookies to be sent in cross-site requests
            sameSite: isPreview ? 'none' : (options.sameSite || 'lax'),
            // Cookies must be secure when sameSite is 'none'
            secure: isPreview ? true : (options.secure || false),
          };
          
          request.cookies.set({
            name,
            value,
            ...cookieOptions,
          })
          
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          
          response.cookies.set({
            name,
            value,
            ...cookieOptions,
          })
        },
        remove(name: string, options: CookieOptions) {
          // Same modifications for removing cookies
          const cookieOptions = {
            ...options,
            domain: isPreview ? undefined : options.domain,
            sameSite: isPreview ? 'none' : (options.sameSite || 'lax'),
            secure: isPreview ? true : (options.secure || false),
          };
          
          request.cookies.set({
            name,
            value: '',
            ...cookieOptions,
          })
          
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          
          response.cookies.set({
            name,
            value: '',
            ...cookieOptions,
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}