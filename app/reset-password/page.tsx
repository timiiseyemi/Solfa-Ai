import { Suspense } from 'react'
import { AuthFormLoading, ResetPasswordForm } from '@/components/auth/auth-forms'

export default function ResetPasswordPage() {
  return <Suspense fallback={<AuthFormLoading />}><ResetPasswordForm /></Suspense>
}
