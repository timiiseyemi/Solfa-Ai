'use client'

import { useRef } from 'react'
import { ACCEPTED_SONG_TYPES } from '@/lib/upload/uploadSong'

export function UploadButton({
  children,
  className,
  disabled = false,
  onFileSelected,
}: {
  children: React.ReactNode
  className: string
  disabled?: boolean
  onFileSelected: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_SONG_TYPES}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ''
          if (file) onFileSelected(file)
        }}
      />
      <button type="button" className={className} disabled={disabled} onClick={() => inputRef.current?.click()}>
        {children}
      </button>
    </>
  )
}
