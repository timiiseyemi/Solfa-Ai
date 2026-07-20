'use client'

import { useState, type DragEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function UploadDropzone({
  children,
  className,
  disabled = false,
  onFileSelected,
}: {
  children: ReactNode
  className?: string
  disabled?: boolean
  onFileSelected: (file: File) => void
}) {
  const [dragging, setDragging] = useState(false)

  const stopDrag = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div
      className={cn('relative', className)}
      onDragEnter={(event) => {
        stopDrag(event)
        if (!disabled) setDragging(true)
      }}
      onDragOver={stopDrag}
      onDragLeave={(event) => {
        stopDrag(event)
        if (event.currentTarget === event.target) setDragging(false)
      }}
      onDrop={(event) => {
        stopDrag(event)
        setDragging(false)
        if (!disabled) {
          const file = event.dataTransfer.files?.[0]
          if (file) onFileSelected(file)
        }
      }}
    >
      {children}
      {dragging && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center rounded-[1.75rem] border-2 border-blue-300 bg-[#0b1a38]/88 backdrop-blur-sm">
          <p className="text-sm font-medium text-white">Drop your recording to upload</p>
        </div>
      )}
    </div>
  )
}
