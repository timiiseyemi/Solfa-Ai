'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, CheckCircle2, KeyRound, Loader2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AuthCard } from './auth-card'
import { AuthFooter } from './auth-footer'
import { AuthHeader } from './auth-header'
import { AuthInput } from './auth-input'
import { Divider } from './divider'
import { PasswordInput } from './password-input'
import { SocialButton } from './social-button'
import {
  resendVerificationEmail,
  sendPasswordResetEmail,
  signInWithEmail,
  signUpWithEmail,
  updatePassword,
} from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/client'

const emailSchema = z.string().trim().email('Enter a valid email address.')
const passwordSchema = z.string().min(8, 'Password must contain at least 8 characters.')

function SubmitButton({ children, loading }: { children: string; loading: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: loading ? 1 : 1.01 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      disabled={loading}
      className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-white text-sm font-medium text-[#0a0a10] transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-label="Loading" /> : children}
    </motion.button>
  )
}

function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null
  return <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200">{message}</p>
}

function SuccessMessage({ message }: { message: string | null }) {
  if (!message) return null
  return <p role="status" className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-200">{message}</p>
}

export function AuthFormLoading() {
  return (
    <AuthCard>
      <div className="flex min-h-56 items-center justify-center" role="status" aria-label="Loading">
        <Loader2 className="size-5 animate-spin text-blue-300" />
      </div>
    </AuthCard>
  )
}

const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password.'),
  remember: z.boolean(),
})
type SignInValues = z.infer<typeof signInSchema>

export function SignInForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  const submit = async (values: SignInValues) => {
    if (loading) return
    setLoading(true)
    setSubmitError(null)
    const result = await signInWithEmail({ email: values.email, password: values.password })
    setLoading(false)

    if (result.error !== null) {
      setSubmitError(result.error)
      return
    }

    router.replace('/dashboard')
    router.refresh()
  }

  const useDemo = () => {
    setSubmitError(null)
    setValue('email', 'ryokulab@gmail.com', { shouldValidate: true })
    setValue('password', 'h4@wZ687i6MxCuv', { shouldValidate: true })
  }

  return (
    <AuthCard>
      <AuthHeader title="Welcome back" description="Pick up exactly where your music left off." />
      <form onSubmit={handleSubmit(submit)} className="mt-7 space-y-4" noValidate>
        <AuthInput label="Email address" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <div>
          <PasswordInput autoComplete="current-password" error={errors.password?.message} {...register('password')} />
          <div className="mt-3 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-white/55">
              <input type="checkbox" className="size-3.5 rounded border-white/20 bg-white/5 accent-white" {...register('remember')} />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-xs font-medium text-blue-300 hover:text-white">Forgot password?</Link>
          </div>
        </div>
        <ErrorMessage message={submitError} />
        <SubmitButton loading={loading}>Sign in</SubmitButton>
      </form>
      <Divider />
      <SocialButton />
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-blue-300/25 bg-blue-500/[0.08] p-4 shadow-lg shadow-blue-950/10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-7 -top-7 size-24 rounded-full bg-blue-400/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl border border-blue-300/20 bg-blue-400/10 text-blue-100"><LockKeyhole className="size-4" /></span>
            <div><p className="text-sm font-semibold text-white">Demo workspace</p><p className="mt-0.5 text-xs text-white/50">Explore SolfaAI with a ready account.</p></div>
          </div>
          <dl className="mt-4 grid gap-2 rounded-xl border border-white/10 bg-black/10 p-3 text-xs">
            <div className="flex items-center justify-between gap-3"><dt className="text-white/45">Email</dt><dd className="truncate font-medium text-white/80">ryokulab@gmail.com</dd></div>
            <div className="flex items-center justify-between gap-3"><dt className="text-white/45">Password</dt><dd className="flex items-center gap-1.5 font-medium tracking-[0.16em] text-white/70"><KeyRound className="size-3.5 text-blue-200" />••••••••••••••</dd></div>
          </dl>
          <button type="button" onClick={useDemo} className="group mt-3.5 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-[#0a0a10] transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/25">Continue with demo <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" /></button>
        </div>
      </div>
      <div className="hidden">
        <div className="flex items-center gap-2 text-sm font-medium text-white"><span aria-hidden="true">🚀</span> Demo Account</div>
        <p className="mt-2 text-xs leading-5 text-white/55">judge@solfaai.com<br />Password: ••••••••</p>
        <button type="button" onClick={useDemo} className="mt-3 text-xs font-medium text-blue-200 transition hover:text-white">Login as Demo</button>
      </div>
      <AuthFooter question="New to SolfaAI?" href="/signup" linkLabel="Create an account" />
    </AuthCard>
  )
}

const signUpSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  terms: z.boolean().refine(Boolean, 'Please accept the terms to continue.'),
}).refine((values) => values.password === values.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
})
type SignUpValues = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: false },
  })

  const submit = async (values: SignUpValues) => {
    if (loading) return
    setLoading(true)
    setSubmitError(null)
    const result = await signUpWithEmail({ fullName: values.name, email: values.email, password: values.password })
    setLoading(false)

    if (result.error !== null) {
      setSubmitError(result.error)
      return
    }

    if (result.needsEmailVerification) {
      router.replace(`/verify-email?email=${encodeURIComponent(result.email)}`)
      return
    }

    router.replace('/dashboard')
    router.refresh()
  }

  return (
    <AuthCard>
      <AuthHeader title="Create your account" description="Start learning every song more deeply." />
      <form onSubmit={handleSubmit(submit)} className="mt-7 space-y-4" noValidate>
        <AuthInput label="Full name" autoComplete="name" placeholder="Your name" error={errors.name?.message} {...register('name')} />
        <AuthInput label="Email address" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <PasswordInput autoComplete="new-password" error={errors.password?.message} {...register('password')} />
        <PasswordInput label="Confirm password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <div>
          <label className="flex cursor-pointer items-start gap-2 text-xs leading-5 text-white/55">
            <input type="checkbox" className="mt-0.5 size-3.5 rounded border-white/20 bg-white/5 accent-white" {...register('terms')} />
            I agree to the <a href="#" className="text-blue-300 hover:text-white">Terms of Service</a> and <a href="#" className="text-blue-300 hover:text-white">Privacy Policy</a>.
          </label>
          {errors.terms && <p role="alert" className="mt-1.5 text-xs text-red-300">{errors.terms.message}</p>}
        </div>
        <ErrorMessage message={submitError} />
        <SubmitButton loading={loading}>Create account</SubmitButton>
      </form>
      <Divider />
      <SocialButton />
      <AuthFooter question="Already have an account?" href="/signin" linkLabel="Sign in" />
    </AuthCard>
  )
}

const forgotSchema = z.object({ email: emailSchema })
type ForgotValues = z.infer<typeof forgotSchema>

export function ForgotPasswordForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  const submit = async ({ email }: ForgotValues) => {
    if (loading) return
    setLoading(true)
    setSubmitError(null)
    const result = await sendPasswordResetEmail(email)
    setLoading(false)
    if (result.error) {
      setSubmitError(result.error)
      return
    }
    router.replace(`/email-sent?type=reset&email=${encodeURIComponent(email)}`)
  }

  return (
    <AuthCard>
      <AuthHeader title="Reset your password" description="Enter your email and we’ll send a reset link." />
      <form onSubmit={handleSubmit(submit)} className="mt-7 space-y-4" noValidate>
        <AuthInput label="Email address" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <ErrorMessage message={submitError} />
        <SubmitButton loading={loading}>Send reset link</SubmitButton>
      </form>
      <AuthFooter question="Remembered your password?" href="/signin" linkLabel="Back to sign in" />
    </AuthCard>
  )
}

const resetSchema = z.object({ password: passwordSchema, confirmPassword: z.string() }).refine(
  (values) => values.password === values.confirmPassword,
  { message: 'Passwords do not match.', path: ['confirmPassword'] },
)
type ResetValues = z.infer<typeof resetSchema>

export function ResetPasswordForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)
  const [submitError, setSubmitError] = useState(() => authLinkError(params))
  const { register, handleSubmit, formState: { errors } } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const submit = async ({ password }: ResetValues) => {
    if (loading) return
    setLoading(true)
    setSubmitError(null)
    const result = await updatePassword(password)
    setLoading(false)
    if (result.error) {
      setSubmitError(result.error)
      return
    }
    setComplete(true)
    window.setTimeout(() => router.replace('/signin'), 1200)
  }

  return (
    <AuthCard>
      <AuthHeader title="Choose a new password" description="Make it unique and easy for you to remember." />
      {complete ? (
        <SuccessBlock icon={<CheckCircle2 />} title="Password updated" description="You can now sign in with your new password." />
      ) : (
        <form onSubmit={handleSubmit(submit)} className="mt-7 space-y-4" noValidate>
          <PasswordInput label="New password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
          <PasswordInput label="Confirm new password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          <ErrorMessage message={submitError} />
          <SubmitButton loading={loading}>Update password</SubmitButton>
        </form>
      )}
    </AuthCard>
  )
}

function SuccessBlock({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-200 [&_svg]:size-7">{icon}</span>
      <h2 className="mt-5 text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{description}</p>
    </motion.div>
  )
}

export function EmailSentPage() {
  const params = useSearchParams()
  const type = params.get('type') === 'signup' ? 'signup' : 'reset'
  const email = params.get('email') ?? ''
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const resend = async () => {
    if (!email || loading) return
    setLoading(true)
    setError(null)
    setSuccess(null)
    const result = type === 'signup'
      ? await resendVerificationEmail(email)
      : await sendPasswordResetEmail(email)
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setSuccess('A new email is on its way. Check your inbox and spam folder.')
  }

  const isVerification = type === 'signup'
  return (
    <AuthCard>
      <AuthHeader title="Check your inbox" description={isVerification ? 'We’ve sent a verification link to your email address.' : 'We’ve sent a password reset link to your email address.'} />
      <SuccessBlock icon={<Mail />} title="Email on its way" description={isVerification ? 'Open the link to verify your account. If it expires, you can request another one here.' : 'The link will expire soon. If it doesn’t arrive, check your spam folder.'} />
      <div className="mt-6 space-y-3">
        <SuccessMessage message={success} />
        <ErrorMessage message={error} />
      </div>
      <Link href="/signin" className="mt-8 flex h-11 items-center justify-center rounded-xl bg-white text-sm font-medium text-[#0a0a10] transition hover:bg-white/90">Back to sign in</Link>
      {email && <button type="button" onClick={resend} disabled={loading} className="mt-4 flex w-full items-center justify-center gap-2 text-center text-sm text-blue-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-60">{loading && <Loader2 className="size-4 animate-spin" />}Resend email</button>}
    </AuthCard>
  )
}

export function VerifyEmailPage() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get('email') ?? ''
  const linkError = authLinkError(params)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(linkError)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const redirectIfVerified = () => {
      void supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user.email_confirmed_at) {
          router.replace('/dashboard')
          router.refresh()
        }
      })
    }

    redirectIfVerified()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user.email_confirmed_at) {
        router.replace('/dashboard')
        router.refresh()
      }
    })
    return () => subscription.unsubscribe()
  }, [router])

  const resend = async () => {
    if (!email || loading) return
    setLoading(true)
    setError(null)
    setSuccess(null)
    const result = await resendVerificationEmail(email)
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setSuccess('A new verification email is on its way. Check your inbox and spam folder.')
  }

  return (
    <AuthCard>
      <AuthHeader title="Verify your email" description="One quick step before you can begin." />
      <div className="mt-9 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-200"><ShieldCheck className="size-8" /></span>
        {!linkError && <Loader2 className="mx-auto mt-6 size-5 animate-spin text-blue-300" aria-label="Waiting for email verification" />}
        <p className="mt-5 text-sm leading-relaxed text-white/55">{linkError ? 'This verification link has expired or is no longer valid. Request another email below.' : 'We’ve sent a confirmation link to your inbox. Once it’s verified, you’ll be ready to make music.'}</p>
      </div>
      <div className="mt-6 space-y-3">
        <SuccessMessage message={success} />
        <ErrorMessage message={error} />
      </div>
      {email && <button type="button" onClick={resend} disabled={loading} className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-medium text-[#0a0a10] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60">{loading && <Loader2 className="size-4 animate-spin" />}Resend verification email</button>}
      <Link href="/signin" className="mt-4 flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-medium text-white transition hover:bg-white/[0.08]">Return to sign in</Link>
    </AuthCard>
  )
}

function authLinkError(params: ReturnType<typeof useSearchParams>) {
  const error = params.get('error')
  const code = params.get('error_code')
  if (!error && !code) return null
  return 'This link has expired or is no longer valid. Please request another email.'
}
