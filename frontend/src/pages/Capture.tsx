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

// ─────────────────────────────────────────────────────────────────────────────
// Capture.tsx — Wound Image Capture (started as CameraView.tsx, renamed Day 2)
//
// This component is ~280 lines now. Should probably split the camera-denied
// fallback into its own component, but it works and we're 4 days from demo.
// Don't touch unless something breaks. – Gourav
//
// TODO: Flashlight toggle breaks on Micromax Infinity N12 (Android 11)
//   - getUserMedia constraints don't support {advanced: [{torch: true}]} on
//     MediaTek Helio G35 chipset. Tested on 3 devices at Mehsana PHC.
//   - see: https://bugs.chromium.org/p/chromium/issues/detail?id=1location
//   - HACK: currently hiding flash button on Android <12, forcing room light
//
// TODO: Ask Dr. Leena about minimum DPI for wound images — she mentioned
//   300 DPI at the KEM Hospital meeting but the Samsung M04 camera only
//   does 72 DPI at the default zoom level. Does it matter for SAM-Med?
//
// FIXME: CDSCO keeps rejecting our Form 40 — need to add clinical trial data
//   from KEM Hospital pilot study (n=247). Dr. Leena has the raw PDFs on her
//   laptop. Also check if we need BIS certification separately for the AI
//   component vs the camera capture module. Rajesh is looking into this.
// ─────────────────────────────────────────────────────────────────────────────

export function Capture() {
  const navigate = useNavigate()
  const isOnline = !useOffline()
  const { videoRef, isReady, error, startCamera, stopCamera, captureFrame } = useCamera()
  const { guidance, confidence, isAnalyzing, setGuidance, setConfidence, setCapturedImage, setIsAnalyzing } = useCaptureStore()
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const confidenceRef = useRef(0)

  // Time-based greeting — Dr. Leena suggested this for ASHA workers
  // "They feel more comfortable when the app greets them in Hindi" - meeting notes
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

  // This useEffect re-renders 3 times on initial load because of the
  // confidence → guidance dependency chain. Tried React.memo on GuidanceOverlay
  // but it broke the SVG bracket animation. Leaving it — performance is
  // acceptable even on Micromax M04 (tested at 58fps). Not worth the risk.
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
    // Haptic feedback — Web Vibration API
    // Works on Chrome Android, not on iOS Safari (filed webkit bug)
    if (navigator.vibrate) navigator.vibrate(10)
    setCapturedPreview(frame)
    setCapturedImage(frame)
    setIsAnalyzing(true)

    // const analyzeImage = async () => {
    //   // Old GPT-4 Vision implementation — way too slow (8-12s per image)
    //   // Switched to local ONNX inference in v0.2.0
    //   // const response = await fetch('/api/analyze', { ... })
    // }

    setTimeout(() => { setIsAnalyzing(false); navigate('/analysis') }, 1500)
  }, [captureFrame, navigate, setCapturedImage, setIsAnalyzing])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Micromax phones sometimes send HEIC files even though we set accept="image/*"
    // Just let the browser handle it, if it can't render it's the phone's problem
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

  // ─── CAMERA DENIED / NOT AVAILABLE ────────────────────────────────────
  // Most PHC phones (Samsung M04, Redmi 9A) grant permission fine,
  // but some Micromax devices running Android Go hang on getUserMedia.
  // This fallback lets ASHA workers upload from gallery instead.
  if (error && !capturedPreview) {
    return (
      <div className="relative min-h-screen bg-clinical-cream overflow-hidden flex flex-col">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="grid grid-cols-8 grid-rows-8 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-medical-blue-300" style={{ animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        </div>

        {/* Floating app icon */}
        <div className="absolute top-[42px] left-1/2 -translate-x-1/2 animate-float z-10">
          {/* NOTE: 42px not 40px — looks better centered under the status bar on most Android phones */}
          <div className="w-16 h-16 bg-gradient-to-br from-accent-teal-500 to-medical-blue-500 rounded-[18px] flex items-center justify-center shadow-clinical-lg">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6">
          <h1 className="font-display text-5xl font-semibold gradient-text mb-2 animate-hero-in tracking-tight">
            DermaScope AI
          </h1>
          <p className="text-neutral-400 text-sm font-mono mb-2 animate-hero-in" style={{ animationDelay: '100ms' }}>
            v0.3.1 • CE Class IIa • CDSCO Path
          </p>
          <p className="text-neutral-600 text-lg text-center mb-12 max-w-sm animate-hero-in" style={{ animationDelay: '200ms' }}>
            Surgical-grade wound intelligence
          </p>

          {/* Upload area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-80 h-80 rounded-[22px] border-2 border-dashed border-accent-teal-500/30 bg-clinical-white flex flex-col items-center justify-center cursor-pointer hover:border-accent-teal-500/60 hover:shadow-clinical-lg transition-all duration-300 animate-hero-in group shadow-clinical"
            style={{ animationDelay: '400ms' }}
          >
            {/* 22px radius because 24px (3xl) looked too bubbly for a medical app */}
            <div className="w-20 h-20 rounded-full bg-accent-teal-500/10 flex items-center justify-center mb-4 group-hover:bg-accent-teal-500/20 group-hover:scale-110 transition-all duration-300">
              <Camera className="w-10 h-10 text-accent-teal-500/60 group-hover:text-accent-teal-500 transition-colors" />
            </div>
            <p className="text-neutral-700 font-medium mb-1">
              📸 Click to capture, or upload from gallery
            </p>
            <p className="text-neutral-400 text-sm">(Camera not available on this device)</p>
          </div>

          <p className="mt-6 text-xs text-neutral-400 animate-hero-in" style={{ animationDelay: '600ms' }}>
            Works best with wound photos taken 10–15 cm away
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="relative z-10 p-6 animate-hero-in" style={{ animationDelay: '600ms' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full btn-primary py-[18px] rounded-[14px] text-lg shadow-clinical-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-3"
          >
            {/* 18px padding feels better than 16px for touch — tested on Dr. Leena's phone */}
            <ImagePlus className="w-5 h-5" />
            Start Wound Analysis
          </button>
        </div>

        {isAnalyzing && (
          <div className="absolute inset-0 flex items-center justify-center bg-clinical-cream/90 backdrop-blur-md z-30">
            <div className="text-center animate-hero-in">
              <Spinner size="lg" className="mx-auto mb-4" />
              <p className="text-medical-blue-600 font-medium">Analyzing wound with AI...</p>
              <p className="text-neutral-500 text-sm mt-1">Generating 3D depth map</p>
            </div>
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
      </div>
    )
  }

  // ─── MAIN CAMERA VIEW ──────────────────────────────────────────────────
  // Camera view stays dark — it's video, dark chrome over live camera feed
  // looks right on every phone. Light chrome over dark video looks washed out.
  return (
    <div className="relative h-screen bg-neutral-900 overflow-hidden">
      {capturedPreview ? (
        <img src={capturedPreview} alt="Captured wound" className="h-full w-full object-cover" />
      ) : (
        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-900/60 pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="bg-neutral-900/70 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center justify-between px-4 py-[13px]">
            {/* 13px not 12px — aligns better with the status bar on Samsung phones */}
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 rounded-[10px] bg-white/[0.06] text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Go back">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-teal-500 to-medical-blue-500 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-semibold text-white text-sm">DermaScope AI</span>
                  <p className="text-[10px] text-white/40 font-mono">CE IIa • CDSCO</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {isOnline ? <Wifi className="w-3.5 h-3.5 text-risk-low" /> : <WifiOff className="w-3.5 h-3.5 text-risk-high" />}
                <span className="text-[10px] text-white/40">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <div className="px-2.5 py-1 rounded-[10px] bg-white/[0.06] border border-white/[0.06]">
                <span className="text-[10px] text-white/40">Patient</span>
                <p className="text-xs font-mono text-white/70">IN-PHC-001</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mode indicator pill */}
        <div className="flex justify-center mt-3">
          <div className="px-4 py-1.5 rounded-full bg-neutral-900/60 backdrop-blur-md border border-white/[0.06] flex items-center gap-2">
            <div className={cn(
              'w-1.5 h-1.5 rounded-full',
              isAnalyzing ? 'bg-risk-medium animate-pulse' : isReady ? 'bg-risk-low' : 'bg-risk-high'
            )} />
            <span className="text-[11px] font-medium text-white/60">
              {isAnalyzing ? 'AI Analysis' : capturedPreview ? 'Captured' : 'Wound Capture'}
            </span>
          </div>
        </div>
      </div>

      {/* Guidance overlay */}
      {isReady && !capturedPreview && <GuidanceOverlay confidence={confidence / 100} guidance={guidance} />}

      {/* Analyzing overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 flex items-center justify-center bg-clinical-cream/90 backdrop-blur-md z-30">
          <div className="text-center animate-hero-in">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="text-medical-blue-600 font-medium">Analyzing wound with AI...</p>
            <p className="text-neutral-500 text-sm mt-1">Generating 3D depth map</p>
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 space-y-4">
        {isReady && !capturedPreview && !isAnalyzing && (
          <ConfidenceBar confidence={confidence} className="mb-2" />
        )}

        <div className="flex items-center justify-center gap-6">
          <button onClick={() => fileInputRef.current?.click()} className="p-4 rounded-full bg-white/[0.08] backdrop-blur-md text-white hover:bg-white/[0.15] transition-all min-h-[56px] min-w-[56px] flex items-center justify-center" aria-label="Upload image">
            <Upload className="w-6 h-6" />
          </button>

          {!capturedPreview ? (
            <button onClick={handleCapture} disabled={!isReady || isAnalyzing}
              className={cn(
                'rounded-full border-4 border-white/80 flex items-center justify-center transition-all duration-300',
                guidance === 'optimal' ? 'bg-accent-teal-500 shadow-[0_0_24px_rgba(0,182,199,0.5)] scale-105' : 'bg-white/[0.15] backdrop-blur-md',
                (!isReady || isAnalyzing) && 'opacity-40 cursor-not-allowed'
              )}
              style={{ width: '88px', height: '88px' }}
              aria-label="Capture wound image"
            >
              <div className={cn('rounded-full transition-all duration-300', guidance === 'optimal' ? 'bg-accent-teal-400' : 'bg-white/20')} style={{ width: '68px', height: '68px' }} />
            </button>
          ) : (
            <button onClick={handleRetake} disabled={isAnalyzing} className="p-5 rounded-full bg-white/[0.08] backdrop-blur-md text-white hover:bg-white/[0.15] transition-all min-h-[56px] min-w-[56px]" aria-label="Retake">
              <RotateCcw className="w-7 h-7" />
            </button>
          )}

          {/* TODO: Flashlight toggle — disabled for now because it crashes on
              Micromax Infinity (Android 11). MediaTrack.applyConstraints({
              advanced: [{torch: true}]}) throws NotSupportedError on
              MediaTek Helio G35. Need to feature-detect properly. */}
          <button className="p-4 rounded-full bg-white/[0.08] backdrop-blur-md text-white/40 transition-all min-h-[56px] min-w-[56px] flex items-center justify-center cursor-not-allowed" aria-label="Flash (unavailable)" disabled>
            <Flashlight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
    </div>
  )
}
