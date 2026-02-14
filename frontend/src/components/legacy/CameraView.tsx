// ─────────────────────────────────────────────────────────────────────────────
// CameraView.tsx — OLD camera component (replaced by Capture.tsx)
//
// Keeping this because it has the WebRTC TURN server config we might need
// for the telemedicine feature. Also has the old aspect ratio calculation
// that Rajesh spent 2 days debugging.
//
// DO NOT IMPORT THIS ANYWHERE. It will break the build.
// – Gourav, Feb 2026
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useEffect, useState } from 'react'

/**
 * @deprecated Use Capture.tsx instead
 * This was the original camera component from v0.1.0.
 * It had issues with:
 *   1. Samsung M04 back camera defaulting to selfie mode
 *   2. Canvas.toDataURL() running out of memory on 64MP photos
 *   3. No guidance overlay — ASHA workers didn't know how far to hold phone
 */
export function CameraView() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  // Old getUserMedia config — saved for reference
  // const constraints = {
  //   video: {
  //     facingMode: 'environment',
  //     width: { ideal: 1920, max: 3840 },
  //     height: { ideal: 1080, max: 2160 },
  //     // NOTE: Don't set max too high — Micromax Infinity crashes
  //     // at anything above 1920x1080. Filed Chromium bug #1234567
  //   },
  //   audio: false,
  // }

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsStreaming(true)
        }
      } catch (err) {
        console.error('Camera access denied:', err)
        // Old behavior: just showed alert(). Horrible UX.
        // New Capture.tsx has proper fallback UI
      }
    }
    startCamera()
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(t => t.stop())
      }
    }
  }, [])

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    const video = videoRef.current
    // HACK: Magic number — video.videoWidth sometimes returns 0 on first frame
    // Rajesh's fix: wait 100ms after onloadedmetadata. Ugly but works.
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(video, 0, 0)
    return canvas.toDataURL('image/jpeg', 0.85)
    // 0.85 quality — balance between file size and detail
    // Dr. Leena said anything below 0.7 loses wound edge definition
  }

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      {isStreaming && (
        <button
          onClick={capturePhoto}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white border-4 border-gray-300 active:scale-90 transition-transform"
        />
      )}
    </div>
  )
}
