import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCamera } from '@/hooks/useCamera'
import { useCaptureStore } from '@/lib/stores'
import { GuidanceOverlay } from '@/components/molecules/GuidanceOverlay'
import { ConfidenceBar } from '@/components/atoms/ConfidenceBar'
import { Spinner } from '@/components/atoms/Spinner'
import { Camera, Upload, ArrowLeft, RotateCcw, Flashlight, ImagePlus, Stethoscope, Wifi, WifiOff } from 'lucide-react'
import { useOffline } from '@/hooks/useOffline'
import { cn } from '@/lib/utils'

export function Capture() {
  const navigate = useNavigate()
  const isOnline = !useOffline()
  const { videoRef, isReady, error, startCamera, stopCamera, captureFrame } = useCamera()
  const { guidance, confidence, isAnalyzing, setGuidance, setConfidence, setCapturedImage, setIsAnalyzing } = useCaptureStore()
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const confidenceRef = useRef(0)

  useEffect(() => {
    confidenceRef.current = confidence
  }, [confidence])

  useEffect(() => {
    setConfidence(0)
    setGuidance('searching')
    startCamera()
    return () => stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  // ─── CLINICAL HEADER (shared across both states) ────────────
  const clinicalHeader = (
    <div className="absolute top-0 left-0 right-0 z-20">
      <div className="bg-medical-blue/85 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-medical-teal" />
              <div>
                <span className="font-semibold text-white text-sm">DermaScope AI</span>
                <p className="text-[10px] text-white/50 font-mono">v2.1 • CE Class IIa</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Online/Offline indicator */}
            <div className="flex items-center gap-1.5">
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-risk-low" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-risk-high" />
              )}
              <span className="text-[10px] text-white/60">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Patient badge */}
            <div className="px-2.5 py-1 rounded-md bg-white/10 border border-white/10">
              <span className="text-[10px] text-white/50">Patient</span>
              <p className="text-xs font-mono text-white/80">IN-PHC-001</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mode indicator bar */}
      <div className="bg-black/40 backdrop-blur-sm px-4 py-1.5 flex items-center justify-center gap-2">
        <div className={cn(
          'w-1.5 h-1.5 rounded-full',
          isAnalyzing ? 'bg-risk-medium animate-pulse' : isReady ? 'bg-risk-low' : 'bg-risk-high'
        )} />
        <span className="text-[11px] font-medium text-white/80">
          {isAnalyzing ? 'AI Analysis in Progress' : capturedPreview ? 'Image Captured' : 'Wound Capture Mode'}
        </span>
      </div>
    </div>
  )

  // ─── CAMERA DENIED / ERROR STATE ────────────────────────────
  if (error && !capturedPreview) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-gray-900 via-medical-blue to-gray-900 flex flex-col items-center justify-center p-6">
        {clinicalHeader}

        <div className="text-center max-w-sm mt-16">
          <div className="w-20 h-20 rounded-full bg-medical-teal/20 flex items-center justify-center mx-auto mb-6">
            <Camera className="w-10 h-10 text-medical-teal/60" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Camera Not Available</h2>
          <p className="text-sm text-white/60 mb-8">{error}</p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-medical-teal to-medical-teal/80 text-white font-semibold text-lg flex items-center justify-center gap-3 shadow-lg shadow-medical-teal/20 hover:shadow-xl hover:shadow-medical-teal/30 transition-all active:scale-95"
          >
            <ImagePlus className="w-6 h-6" />
            Upload Wound Image
          </button>

          <p className="mt-4 text-xs text-white/40">JPG, PNG, or WebP • Max 10 MB</p>

          <div className="mt-8 p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/50">
              💡 <span className="text-medical-teal">Demo:</span> Upload any wound photo to see AI analysis
            </p>
          </div>
        </div>

        {isAnalyzing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-30">
            <div className="text-center">
              <Spinner size="lg" className="mx-auto mb-4" />
              <p className="text-white font-medium">Running AI segmentation...</p>
              <p className="text-white/50 text-sm mt-1">SAM-Med model processing</p>
            </div>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
      </div>
    )
  }

  // ─── NORMAL CAMERA VIEW ─────────────────────────────────────
  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {capturedPreview ? (
        <img src={capturedPreview} alt="Captured wound" className="h-full w-full object-cover" />
      ) : (
        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Clinical header */}
      {clinicalHeader}

      {/* Guidance overlay */}
      {isReady && !capturedPreview && <GuidanceOverlay status={guidance} />}

      {/* Analyzing overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-30">
          <div className="text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="text-white font-medium">Running AI segmentation...</p>
            <p className="text-white/50 text-sm mt-1">SAM-Med + ZoE-Depth processing</p>
          </div>
        </div>
      )}

      {/* Bottom controls – larger touch targets for gloved hands */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 space-y-4">
        {isReady && !capturedPreview && !isAnalyzing && (
          <ConfidenceBar confidence={confidence} className="mb-2" />
        )}

        <div className="flex items-center justify-center gap-6">
          {/* Upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors min-h-[56px] min-w-[56px] flex items-center justify-center"
            aria-label="Upload image"
          >
            <Upload className="w-6 h-6" />
          </button>

          {/* Capture / Retake */}
          {!capturedPreview ? (
            <button
              onClick={handleCapture}
              disabled={!isReady || isAnalyzing}
              className={cn(
                'w-22 h-22 rounded-full border-4 border-white flex items-center justify-center transition-all duration-200',
                guidance === 'optimal'
                  ? 'bg-medical-teal shadow-lg shadow-medical-teal/30 scale-105'
                  : 'bg-white/20 backdrop-blur-sm',
                (!isReady || isAnalyzing) && 'opacity-50 cursor-not-allowed'
              )}
              style={{ width: '88px', height: '88px' }}
              aria-label="Capture wound image"
            >
              <div
                className={cn(
                  'w-18 h-18 rounded-full transition-colors duration-200',
                  guidance === 'optimal' ? 'bg-medical-teal' : 'bg-white/30'
                )}
                style={{ width: '72px', height: '72px' }}
              />
            </button>
          ) : (
            <button
              onClick={handleRetake}
              disabled={isAnalyzing}
              className="p-5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors min-h-[56px] min-w-[56px]"
              aria-label="Retake photo"
            >
              <RotateCcw className="w-7 h-7" />
            </button>
          )}

          {/* Flash toggle */}
          <button
            className="p-4 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors min-h-[56px] min-w-[56px] flex items-center justify-center"
            aria-label="Toggle flash"
          >
            <Flashlight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
    </div>
  )
}
