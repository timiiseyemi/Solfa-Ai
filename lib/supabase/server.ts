import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates the cookie-aware Supabase client for Server Components, Server Actions,
 * and Route Handlers. Authentication flows will be connected in a later step.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Server Components cannot set cookies. Session refreshes are handled
            // by middleware, so this is expected when called during rendering.
          }
        },
      },
    },
  )
}
