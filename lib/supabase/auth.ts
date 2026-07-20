import { createClient } from './client'

type AuthResult = { error: null } | { error: string }

type SignUpInput = {
  fullName: string
  email: string
  password: string
}

export type SignUpResult =
  | { error: null; email: string; needsEmailVerification: boolean }
  | { error: string }

type SignInInput = {
  email: string
  password: string
}

function getRedirectUrl(pathname: string) {
  if (typeof window === 'undefined') return undefined
  return new URL(pathname, window.location.origin).toString()
}

/** Creates an account and reports whether Supabase requires email confirmation. */
export async function signUpWithEmail({
  fullName,
  email,
  password,
}: SignUpInput): Promise<SignUpResult> {
  try {
    const { data, error } = await createClient().auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: getRedirectUrl('/verify-email'),
      },
    })

    if (error) return { error: toFriendlyAuthError(error.message, error.code, 'signup') }

    // Supabase returns a session only when confirmation is disabled. Keep that
    // session intact so the user can continue straight to their dashboard.
    return {
      error: null,
      email,
      needsEmailVerification: !data.session,
    }
  } catch (error) {
    return { error: toFriendlyUnexpectedError(error, 'create your account') }
  }
}

/** Starts a cookie-backed email/password session. */
export async function signInWithEmail({ email, password }: SignInInput): Promise<AuthResult> {
  try {
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    return error
      ? { error: toFriendlyAuthError(error.message, error.code, 'signin') }
      : { error: null }
  } catch (error) {
    return { error: toFriendlyUnexpectedError(error, 'sign you in') }
  }
}

/** Sends a password-recovery email without exposing provider errors. */
export async function sendPasswordResetEmail(email: string): Promise<AuthResult> {
  try {
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: getRedirectUrl('/reset-password'),
    })
    return error
      ? { error: toFriendlyAuthError(error.message, error.code, 'reset') }
      : { error: null }
  } catch (error) {
    return { error: toFriendlyUnexpectedError(error, 'send the reset email') }
  }
}

/** Sends another account-confirmation email. */
export async function resendVerificationEmail(email: string): Promise<AuthResult> {
  try {
    const { error } = await createClient().auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: getRedirectUrl('/verify-email') },
    })
    return error
      ? { error: toFriendlyAuthError(error.message, error.code, 'verification') }
      : { error: null }
  } catch (error) {
    return { error: toFriendlyUnexpectedError(error, 'send another verification email') }
  }
}

/** Updates the password after Supabase has established a recovery session. */
export async function updatePassword(password: string): Promise<AuthResult> {
  try {
    const { error } = await createClient().auth.updateUser({ password })
    return error
      ? { error: toFriendlyAuthError(error.message, error.code, 'update-password') }
      : { error: null }
  } catch (error) {
    return { error: toFriendlyUnexpectedError(error, 'update your password') }
  }
}

/** Clears only this browser session, leaving other devices signed in. */
export async function signOutLocally(): Promise<AuthResult> {
  try {
    const { error } = await createClient().auth.signOut({ scope: 'local' })
    return error ? { error: 'We could not sign you out. Please try again.' } : { error: null }
  } catch (error) {
    return { error: toFriendlyUnexpectedError(error, 'sign you out') }
  }
}

function toFriendlyAuthError(message: string, code: string | undefined, flow: 'signup' | 'signin' | 'reset' | 'verification' | 'update-password') {
  const normalized = message.toLowerCase()

  if (code === 'email_not_confirmed' || normalized.includes('email not confirmed')) {
    return 'Please verify your email before signing in. Check your inbox for the confirmation link.'
  }
  if (normalized.includes('invalid email')) return 'Enter a valid email address.'
  if (normalized.includes('invalid login credentials')) return 'The email or password you entered is incorrect.'
  if (normalized.includes('already registered')) return 'An account may already exist with this email. Try signing in instead.'
  if (normalized.includes('rate limit') || normalized.includes('too many requests')) return 'Too many attempts. Please wait a moment before trying again.'
  if (normalized.includes('expired') || normalized.includes('otp') || normalized.includes('token') || normalized.includes('session not found')) {
    return flow === 'update-password'
      ? 'This password reset link has expired or is no longer valid. Request a new one and try again.'
      : 'This link has expired or is no longer valid. Please request another email.'
  }
  if (normalized.includes('password')) return 'Please choose a stronger password and try again.'

  if (flow === 'signup') return 'We could not create your account. Please check your details and try again.'
  if (flow === 'signin') return 'We could not sign you in. Please check your details and try again.'
  if (flow === 'update-password') return 'We could not update your password. Please request a new reset link and try again.'
  return 'We could not send that email right now. Please try again shortly.'
}

function toFriendlyUnexpectedError(error: unknown, action: string) {
  if (error instanceof TypeError || (error instanceof Error && /network|fetch/i.test(error.message))) {
    return 'A network error occurred. Check your connection and try again.'
  }
  return `We could not ${action} right now. Please try again shortly.`
}
