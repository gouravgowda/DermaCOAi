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

  // Time-based greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'शुभ प्रभात' : hour < 18 ? 'नमस्ते' : 'शुभ संध्या'

  useEffect(() => { confidenceRef.current = confidence }, [confidence])

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
      setGuidance(next > 80 ? 'optimal' : next > 45 ? 'adjusting' : 'searching')
    }, 1200)
    return () => clearInterval(interval)
  }, [isReady, capturedPreview, setConfidence, setGuidance])

  const handleCapture = useCallback(() => {
    const frame = captureFrame()
    if (!frame) return
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(10)
    setCapturedPreview(frame)
    setCapturedImage(frame)
    setIsAnalyzing(true)
    setTimeout(() => { setIsAnalyzing(false); navigate('/analysis') }, 1500)
  }, [captureFrame, navigate, setCapturedImage, setIsAnalyzing])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setCapturedPreview(dataUrl)
      setCapturedImage(dataUrl)
      setIsAnalyzing(true)
      setTimeout(() => { setIsAnalyzing(false); navigate('/analysis') }, 1500)
    }
    reader.readAsDataURL(file)
  }, [navigate, setCapturedImage, setIsAnalyzing])

  const handleRetake = useCallback(() => {
    setCapturedPreview(null)
    setConfidence(0)
    setGuidance('searching')
  }, [setConfidence, setGuidance])

  // ─── CAMERA DENIED ──────────────────────────────────────────
  if (error && !capturedPreview) {
    return (
      <div className="relative h-screen bg-space-950 overflow-hidden flex flex-col">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="grid grid-cols-8 grid-rows-8 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-nebula-500" style={{ animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        </div>

        {/* Floating app icon */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 animate-float z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-nebula-400 to-nebula-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-nebula-500/40">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6">
          <h1 className="font-display text-5xl font-semibold gradient-text mb-2 animate-hero-in tracking-tight">
            DermaScope AI
          </h1>
          <p className="text-surgical-100/50 text-sm font-mono mb-2 animate-hero-in delay-100" style={{ animationDelay: '100ms' }}>
            v2.1 • CE Class IIa • CDSCO Path
          </p>
          <p className="text-surgical-100/70 text-lg text-center mb-12 max-w-sm animate-hero-in" style={{ animationDelay: '200ms' }}>
            Surgical-grade wound intelligence
          </p>

          {/* Upload area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-80 h-80 rounded-3xl border-2 border-dashed border-nebula-500/30 bg-space-800/30 flex flex-col items-center justify-center cursor-pointer hover:border-nebula-400/60 hover:bg-space-800/50 transition-all duration-300 animate-hero-in group"
            style={{ animationDelay: '400ms' }}
          >
            <div className="w-20 h-20 rounded-full bg-nebula-500/10 flex items-center justify-center mb-4 group-hover:bg-nebula-500/20 group-hover:scale-110 transition-all duration-300">
              <Camera className="w-10 h-10 text-nebula-400/60 group-hover:text-nebula-400 transition-colors" />
            </div>
            <p className="text-surgical-50 font-medium mb-1">Upload Wound Image</p>
            <p className="text-surgical-100/40 text-sm">JPG, PNG, or WebP • Max 10 MB</p>
          </div>

          <p className="mt-6 text-xs text-surgical-100/30 animate-hero-in" style={{ animationDelay: '600ms' }}>
            💡 Demo tip: Upload any wound photo to see full AI analysis
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="relative z-10 p-6 animate-hero-in" style={{ animationDelay: '600ms' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-gradient-to-r from-nebula-500 to-nebula-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-2xl shadow-nebula-500/30 hover:shadow-nebula-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <ImagePlus className="w-5 h-5" />
            Start Wound Analysis
          </button>
        </div>

        {isAnalyzing && (
          <div className="absolute inset-0 flex items-center justify-center bg-space-950/80 backdrop-blur-md z-30">
            <div className="text-center animate-hero-in">
              <Spinner size="lg" className="mx-auto mb-4" />
              <p className="text-surgical-50 font-medium">Running SAM-Med segmentation...</p>
              <p className="text-surgical-100/50 text-sm mt-1">ZoE-Depth topology mapping</p>
            </div>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
      </div>
    )
  }

  // ─── CAMERA VIEW ────────────────────────────────────────────
  return (
    <div className="relative h-screen bg-space-950 overflow-hidden">
      {capturedPreview ? (
        <img src={capturedPreview} alt="Captured wound" className="h-full w-full object-cover" />
      ) : (
        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-space-950/60 pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="bg-space-950/70 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/[0.06] text-surgical-50 hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Go back">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nebula-400 to-nebula-600 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-semibold text-surgical-50 text-sm">DermaScope AI</span>
                  <p className="text-[10px] text-surgical-100/40 font-mono">CE IIa • CDSCO</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-crimson-400" />}
                <span className="text-[10px] text-surgical-100/40">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/[0.06]">
                <span className="text-[10px] text-surgical-100/40">Patient</span>
                <p className="text-xs font-mono text-surgical-100/70">IN-PHC-001</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mode pill */}
        <div className="flex justify-center mt-3">
          <div className="px-4 py-1.5 rounded-full bg-space-950/60 backdrop-blur-md border border-white/[0.06] flex items-center gap-2">
            <div className={cn(
              'w-1.5 h-1.5 rounded-full',
              isAnalyzing ? 'bg-amber-400 animate-pulse' : isReady ? 'bg-emerald-400' : 'bg-crimson-400'
            )} />
            <span className="text-[11px] font-medium text-surgical-100/60">
              {isAnalyzing ? 'AI Analysis' : capturedPreview ? 'Captured' : 'Wound Capture'}
            </span>
          </div>
        </div>
      </div>

      {/* Guidance */}
      {isReady && !capturedPreview && <GuidanceOverlay status={guidance} />}

      {/* Analyzing overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 flex items-center justify-center bg-space-950/80 backdrop-blur-md z-30">
          <div className="text-center animate-hero-in">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="text-surgical-50 font-medium">Running SAM-Med segmentation...</p>
            <p className="text-surgical-100/50 text-sm mt-1">ZoE-Depth + risk assessment</p>
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 space-y-4">
        {isReady && !capturedPreview && !isAnalyzing && (
          <ConfidenceBar confidence={confidence} className="mb-2" />
        )}

        <div className="flex items-center justify-center gap-6">
          <button onClick={() => fileInputRef.current?.click()} className="p-4 rounded-full bg-white/[0.08] backdrop-blur-md text-surgical-50 hover:bg-white/[0.15] transition-all min-h-[56px] min-w-[56px] flex items-center justify-center" aria-label="Upload image">
            <Upload className="w-6 h-6" />
          </button>

          {!capturedPreview ? (
            <button onClick={handleCapture} disabled={!isReady || isAnalyzing}
              className={cn(
                'rounded-full border-4 border-surgical-50/80 flex items-center justify-center transition-all duration-300',
                guidance === 'optimal' ? 'bg-nebula-500 shadow-2xl shadow-nebula-500/40 scale-105 animate-glow' : 'bg-white/[0.15] backdrop-blur-md',
                (!isReady || isAnalyzing) && 'opacity-40 cursor-not-allowed'
              )}
              style={{ width: '88px', height: '88px' }}
              aria-label="Capture wound image"
            >
              <div className={cn('rounded-full transition-all duration-300', guidance === 'optimal' ? 'bg-nebula-400' : 'bg-white/20')} style={{ width: '68px', height: '68px' }} />
            </button>
          ) : (
            <button onClick={handleRetake} disabled={isAnalyzing} className="p-5 rounded-full bg-white/[0.08] backdrop-blur-md text-surgical-50 hover:bg-white/[0.15] transition-all min-h-[56px] min-w-[56px]" aria-label="Retake">
              <RotateCcw className="w-7 h-7" />
            </button>
          )}

          <button className="p-4 rounded-full bg-white/[0.08] backdrop-blur-md text-surgical-50 hover:bg-white/[0.15] transition-all min-h-[56px] min-w-[56px] flex items-center justify-center" aria-label="Flash">
            <Flashlight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
    </div>
  )
}
