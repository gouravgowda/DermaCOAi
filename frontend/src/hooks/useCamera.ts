import { useRef, useState, useCallback } from 'react'

/**
 * useCamera – manages getUserMedia stream with file-upload fallback
 * Uses a ref for the stream to avoid dependency-induced re-render loops.
 */
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  const startCamera = useCallback(async () => {
    // Don't start if already running
    if (streamRef.current) return

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // rear camera for wound capture
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })

      streamRef.current = mediaStream

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }

      setIsReady(true)
      setError(null)
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Camera permission denied – please use file upload instead'
          : 'Camera not available – using file upload'

      setError(message)
      setIsReady(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    const s = streamRef.current
    if (s) {
      s.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setIsReady(false)
    }
  }, [])

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current) return null

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')

    if (!ctx) return null
    ctx.drawImage(videoRef.current, 0, 0)
    return canvas.toDataURL('image/jpeg', 0.9)
  }, [])

  return {
    videoRef,
    isReady,
    error,
    startCamera,
    stopCamera,
    captureFrame,
  }
}
