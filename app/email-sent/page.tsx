import { Suspense } from 'react'
import { AuthFormLoading, EmailSentPage } from '@/components/auth/auth-forms'

export default function EmailSent() {
  return <Suspense fallback={<AuthFormLoading />}><EmailSentPage /></Suspense>
}
