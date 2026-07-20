'use client'

import { motion } from 'motion/react'
import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(function AuthInput(
  { label, error, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name
  return (
    <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.16 }}>
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-white/85">{label}</label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn('h-11 w-full rounded-xl border bg-white/[0.045] px-3.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-blue-400/70 focus:bg-white/[0.07] focus:ring-4 focus:ring-blue-400/10', error ? 'border-red-400/70' : 'border-white/10', className)}
        {...props}
      />
      {error && <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs text-red-300">{error}</p>}
    </motion.div>
  )
})
