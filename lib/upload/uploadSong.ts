import type { SupabaseClient } from '@supabase/supabase-js'

export const ACCEPTED_SONG_TYPES = '.mp3,.wav,.m4a,.ogg,.flac'
export const MAX_SONG_SIZE_BYTES = 25 * 1024 * 1024

const supportedFormats: Record<string, string> = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  m4a: 'audio/mp4',
  ogg: 'audio/ogg',
  flac: 'audio/flac',
}

export type UploadSongResult = { songId: string }

export function validateSongFile(file: File) {
  const extension = getExtension(file.name)

  if (!extension || !(extension in supportedFormats)) {
    return 'Choose an MP3, WAV, M4A, OGG, or FLAC audio file.'
  }

  if (file.size > MAX_SONG_SIZE_BYTES) {
    return 'Choose a file smaller than 25 MB.'
  }

  if (file.size === 0) {
    return 'That file is empty. Please choose another recording.'
  }

  return null
}

export async function uploadSong({
  supabase,
  file,
  onProgress,
}: {
  supabase: SupabaseClient
  file: File
  onProgress: (percentage: number) => void
}): Promise<UploadSongResult> {
  const validationError = validateSongFile(file)
  if (validationError) throw new Error(validationError)

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Your session has expired. Please sign in and try again.')
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    throw new Error('Your session has expired. Please sign in and try again.')
  }

  const extension = getExtension(file.name)!
  const storagePath = `${user.id}/${crypto.randomUUID()}.${extension}`
  const mimeType = file.type || supportedFormats[extension]

  await uploadToStorage({
    file,
    storagePath,
    accessToken: session.access_token,
    mimeType,
    onProgress,
  })

  const { data: song, error: insertError } = await supabase
    .from('songs')
    .insert({
      user_id: user.id,
      original_filename: file.name,
      storage_path: storagePath,
      mime_type: mimeType,
      file_size: file.size,
      status: 'uploaded',
      notation_status: 'pending',
      lesson_status: 'pending',
    })
    .select('id')
    .single()

  if (insertError || !song) {
    await supabase.storage.from('songs').remove([storagePath])
    throw new Error('Your file uploaded, but we could not create the song. Please try again.')
  }

  return { songId: song.id as string }
}

function getExtension(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase()
  return extension && extension !== fileName.toLowerCase() ? extension : null
}

function uploadToStorage({
  file,
  storagePath,
  accessToken,
  mimeType,
  onProgress,
}: {
  file: File
  storagePath: string
  accessToken: string
  mimeType: string
  onProgress: (percentage: number) => void
}) {
  return new Promise<void>((resolve, reject) => {
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!projectUrl || !anonKey) {
      reject(new Error('Upload is not configured. Please try again later.'))
      return
    }

    const encodedPath = storagePath.split('/').map(encodeURIComponent).join('/')
    const request = new XMLHttpRequest()
    request.open('POST', `${projectUrl}/storage/v1/object/songs/${encodedPath}`)
    request.setRequestHeader('Authorization', `Bearer ${accessToken}`)
    request.setRequestHeader('apikey', anonKey)
    request.setRequestHeader('Content-Type', mimeType)
    request.setRequestHeader('x-upsert', 'false')

    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.max(1, Math.min(99, Math.round((event.loaded / event.total) * 100))))
      }
    }

    request.onerror = () => reject(new Error('We could not upload that file. Check your connection and try again.'))
    request.onabort = () => reject(new Error('Upload cancelled.'))
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        onProgress(100)
        resolve()
        return
      }

      reject(new Error(storageErrorMessage(request.responseText)))
    }

    request.send(file)
  })
}

function storageErrorMessage(response: string) {
  try {
    const body = JSON.parse(response) as { message?: string }
    if (body.message?.toLowerCase().includes('row-level security')) {
      return 'You do not have permission to upload to your song library.'
    }
  } catch {
    // Use the generic, user-facing message below.
  }

  return 'We could not upload that file. Please try again.'
}
