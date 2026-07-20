'use client'

import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { uploadSong, validateSongFile } from '@/lib/upload/uploadSong'
import { UploadButton } from './UploadButton'
import { UploadDropzone } from './UploadDropzone'
import { UploadProgress } from './UploadProgress'
import { UploadToast } from './UploadToast'

export function DashboardUploadCard() {
  const router = useRouter()
  const [progress, setProgress] = useState<number | null>(null)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const uploading = progress !== null

  const showError = (message: string) => {
    setError(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setError(null), 6000)
  }

  const beginUpload = async (file: File) => {
    if (uploading) return

    const validationError = validateSongFile(file)
    if (validationError) {
      showError(validationError)
      return
    }

    setError(null)
    setFileName(file.name)
    setProgress(1)

    try {
      const { songId } = await uploadSong({
        supabase: createClient(),
        file,
        onProgress: setProgress,
      })
      router.push(`/songs/${songId}/processing`)
    } catch (uploadError) {
      setProgress(null)
      showError(uploadError instanceof Error ? uploadError.message : 'We could not upload that file. Please try again.')
    }
  }

  return (
    <>
      <UploadDropzone disabled={uploading} onFileSelected={beginUpload}>
        <section className="theme-on-artwork relative mt-10 overflow-hidden rounded-[1.75rem] border border-blue-300/25 bg-gradient-to-br from-[#1d4ed8] via-[#173f92] to-[#0b1737] p-7 shadow-xl shadow-black/20 sm:p-10">
          <img src="/dashboard/upload-song-piano.png" alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover object-right opacity-75" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#173f92]/95 via-[#173f92]/72 to-[#0b1737]/10" />
          <div className="relative max-w-lg">
            <span className="flex size-13 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.12] shadow-lg shadow-black/15"><img src="/icon/video.png" alt="" aria-hidden="true" className="size-9 object-contain" /></span>
            <p className="mt-7 kicker text-white/65">Start something new</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Turn your next song into a lesson.</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">Upload a recording and SolfaAI will prepare notation, sol-fa, and a tailored learning path.</p>
            <UploadButton disabled={uploading} onFileSelected={beginUpload} className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-[#151638] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25 disabled:cursor-not-allowed disabled:opacity-65">
              <Upload className="size-4" />
              {uploading ? 'Uploading…' : 'Upload your first song'}
            </UploadButton>
          </div>
          <div aria-hidden="true" className="absolute bottom-7 right-8 hidden items-end gap-2 opacity-35 sm:flex">{[32, 52, 40, 76, 58, 92, 48, 68, 38].map((height, index) => <span key={index} className="w-2 rounded-full bg-white" style={{ height }} />)}</div>
          {progress !== null && <UploadProgress percentage={progress} fileName={fileName} />}
        </section>
      </UploadDropzone>
      <UploadToast message={error} />
    </>
  )
}
