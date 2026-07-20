'use server'

import { createClient } from '@/lib/supabase/server'

export async function updateProfile({ fullName, bio }: { fullName: string; bio: string }) {
  const normalizedName = fullName.trim()
  if (normalizedName.length < 2) throw new Error('Enter a display name with at least two characters.')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Your session has expired. Please sign in again.')
  const { error } = await supabase.auth.updateUser({ data: { ...user.user_metadata, full_name: normalizedName, bio: bio.trim().slice(0, 280) } })
  if (error) throw error
}
