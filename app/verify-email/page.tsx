import { Suspense } from 'react'
import { AuthFormLoading, VerifyEmailPage } from '@/components/auth/auth-forms'

export default function VerifyEmail() {
  return <Suspense fallback={<AuthFormLoading />}><VerifyEmailPage /></Suspense>
}
