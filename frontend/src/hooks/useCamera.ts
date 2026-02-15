import { useRef, useState, useCallback, useEffect } from 'react'

/**
 * useCamera – manages getUserMedia stream with file-upload fallback
 */
export function useCamera(externalVideoRef?: React.RefObject<HTMLVideoElement | null>) {
  const internalVideoRef = useRef<HTMLVideoElement>(null)
  const videoRef = externalVideoRef || internalVideoRef
  
  const streamRef = useRef<MediaStream | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [confidence, setConfidence] = useState(0)

  // Mock confidence update
  useEffect(() => {
    if (isReady) {
      const interval = setInterval(() => {
        setConfidence(prev => Math.min(prev + 0.1, 0.95))
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isReady])

  const initializeCamera = useCallback(async () => {
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
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }

      setIsReady(true)
      setError(null)
      setConfidence(0.2)
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Camera permission denied – please use file upload instead'
          : 'Camera not available – using file upload'

      setError(message)
      setIsReady(false)
    }
  }, [videoRef])

  const stopCamera = useCallback(() => {
    const s = streamRef.current
    if (s) {
      s.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setStream(null)
      setIsReady(false)
    }
  }, [])

  const captureImage = useCallback(async (): Promise<Blob | null> => {
    if (!videoRef.current) return null

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current!.videoWidth
      canvas.height = videoRef.current!.videoHeight
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        resolve(null)
        return
      }
      
      ctx.drawImage(videoRef.current!, 0, 0)
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9)
    })
  }, [videoRef])

  return {
    videoRef,
    isReady,
    error,
    stream, // Expose stream state
    confidence, // Expose mock confidence
    initializeCamera, // Alias for startCamera
    startCamera: initializeCamera,
    stopCamera,
    captureImage,
  }
}
