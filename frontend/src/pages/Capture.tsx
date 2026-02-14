import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCamera } from '@/hooks/useCamera'
import { useCaptureStore } from '@/lib/stores'
import { GuidanceOverlay } from '@/components/molecules/GuidanceOverlay'
import { ConfidenceBar } from '@/components/atoms/ConfidenceBar'
import { Spinner } from '@/components/atoms/Spinner'
import { Camera, Upload, ArrowLeft, RotateCcw, Flashlight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Capture() {
  const navigate = useNavigate()
  const { videoRef, isReady, error, startCamera, stopCamera, captureFrame } = useCamera()
  const { guidance, confidence, isAnalyzing, setGuidance, setConfidence, setCapturedImage, setIsAnalyzing } = useCaptureStore()
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const confidenceRef = useRef(0)

  // Keep ref in sync (no re-render triggered)
  useEffect(() => {
    confidenceRef.current = confidence
  }, [confidence])

  // Reset store + start camera ONCE on mount
  useEffect(() => {
    setConfidence(0)
    setGuidance('searching')
    startCamera()
    return () => stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Simulate frame analysis – stable deps, never re-created
  useEffect(() => {
    if (!isReady || capturedPreview) return

    const interval = setInterval(() => {
      const current = confidenceRef.current
      const next = Math.min(current + Math.random() * 10 + 2, 100)
      setConfidence(next)

      const newStatus = next > 80 ? 'optimal' : next > 45 ? 'adjusting' : 'searching'
      setGuidance(newStatus)
    }, 1200)

    return () => clearInterval(interval)
  }, [isReady, capturedPreview, setConfidence, setGuidance])

  const handleCapture = useCallback(() => {
    const frame = captureFrame()
    if (!frame) return

    setCapturedPreview(frame)
    setCapturedImage(frame)
    setIsAnalyzing(true)

    // Simulate 1.5s analysis then navigate to results
    setTimeout(() => {
      setIsAnalyzing(false)
      navigate('/analysis')
    }, 1500)
  }, [captureFrame, navigate, setCapturedImage, setIsAnalyzing])

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        setCapturedPreview(dataUrl)
        setCapturedImage(dataUrl)
        setIsAnalyzing(true)

        setTimeout(() => {
          setIsAnalyzing(false)
          navigate('/analysis')
        }, 1500)
      }
      reader.readAsDataURL(file)
    },
    [navigate, setCapturedImage, setIsAnalyzing]
  )

  const handleRetake = useCallback(() => {
    setCapturedPreview(null)
    setConfidence(0)
    setGuidance('searching')
  }, [setConfidence, setGuidance])

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Camera feed or captured preview */}
      {capturedPreview ? (
        <img
          src={capturedPreview}
          alt="Captured wound image"
          className="h-full w-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
      )}

      {/* Gradient overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">
          <span className="text-xs font-medium text-white/90">
            {isAnalyzing ? 'Analyzing...' : 'Wound Capture'}
          </span>
        </div>

        <button
          className="p-2.5 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle flash"
        >
          <Flashlight className="w-5 h-5" />
        </button>
      </div>

      {/* Guidance overlay – only when camera is active */}
      {isReady && !capturedPreview && <GuidanceOverlay status={guidance} />}

      {/* Camera error – fallback to upload */}
      {error && !capturedPreview && (
        <div className="absolute inset-0 flex items-center justify-center bg-medical-blue/90 z-10">
          <div className="text-center p-6 max-w-sm">
            <Camera className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white text-sm mb-2">{error}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary gap-2 mt-4"
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </button>
          </div>
        </div>
      )}

      {/* Analyzing overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-30 animate-fade-in">
          <div className="text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="text-white font-medium">Analyzing wound...</p>
            <p className="text-white/50 text-sm mt-1">AI segmentation in progress</p>
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 space-y-4">
        {/* Confidence bar */}
        {isReady && !capturedPreview && !isAnalyzing && (
          <ConfidenceBar confidence={confidence} className="mb-2" />
        )}

        <div className="flex items-center justify-center gap-8">
          {/* Upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
            aria-label="Upload image"
          >
            <Upload className="w-5 h-5" />
          </button>

          {/* Capture button */}
          {!capturedPreview ? (
            <button
              onClick={handleCapture}
              disabled={!isReady || isAnalyzing}
              className={cn(
                'w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all duration-200',
                guidance === 'optimal'
                  ? 'bg-medical-teal shadow-lg shadow-medical-teal/30'
                  : 'bg-white/20 backdrop-blur-sm',
                (!isReady || isAnalyzing) && 'opacity-50 cursor-not-allowed'
              )}
              aria-label="Capture wound image"
            >
              <div
                className={cn(
                  'w-16 h-16 rounded-full transition-colors duration-200',
                  guidance === 'optimal' ? 'bg-medical-teal' : 'bg-white/30'
                )}
              />
            </button>
          ) : (
            <button
              onClick={handleRetake}
              disabled={isAnalyzing}
              className="p-4 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              aria-label="Retake photo"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          )}

          {/* Placeholder for symmetry */}
          <div className="w-12 h-12" />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
        aria-label="Upload wound image from device"
      />
    </div>
  )
}
