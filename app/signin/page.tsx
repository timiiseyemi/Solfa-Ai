import { SignInForm } from '@/components/auth/auth-forms'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')
  return <SignInForm />
}
