'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState, type InputHTMLAttributes } from 'react'
import { AuthInput } from './auth-input'

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }

export function PasswordInput({ label = 'Password', error, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  const id = props.id ?? props.name
  return (
    <div className="relative">
      <AuthInput label={label} error={error} type={visible ? 'text' : 'password'} className="pr-11" {...props} />
      <button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? 'Hide password' : 'Show password'} className="absolute right-3 top-9 rounded-md p-1 text-white/40 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
      {id && <span className="sr-only">Password visibility toggle</span>}
    </div>
  )
}
