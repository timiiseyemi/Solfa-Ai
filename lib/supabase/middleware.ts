import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard', '/songs', '/lessons', '/profile', '/settings']
const authRoutes = ['/signin', '/signup']

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}

/**
 * Refreshes Supabase auth cookies and redirects unauthenticated visitors away
 * from the authenticated application routes.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value))
        },
      },
    },
  )

  const { data: claims, error } = await supabase.auth.getClaims()
  const isAuthenticated = Boolean(claims) && !error

  if (!isAuthenticated && isProtectedRoute(request.nextUrl.pathname)) {
    const signInUrl = request.nextUrl.clone()
    signInUrl.pathname = '/signin'
    return redirectWithSessionCookies(signInUrl, response)
  }

  if (isAuthenticated && authRoutes.includes(request.nextUrl.pathname)) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    dashboardUrl.search = ''
    return redirectWithSessionCookies(dashboardUrl, response)
  }

  return response
}

function redirectWithSessionCookies(url: URL, response: NextResponse) {
  const redirect = NextResponse.redirect(url)
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
  return redirect
}
