import { useRef, useState, useEffect } from 'react'
import { Camera, Upload, X, HelpCircle, ImagePlus, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCamera } from '@/hooks/useCamera'
import { GuidanceOverlay } from '@/components/molecules/GuidanceOverlay'
import { ConfidenceBar } from '@/components/atoms/ConfidenceBar'
import { cn } from '@/lib/utils'

export function Capture() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showGuidance, setShowGuidance] = useState(true)
  const { stream, error, initializeCamera, captureImage, confidence } = useCamera(videoRef)
  
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null)

  // Initialize camera on mount
  useEffect(() => {
    initializeCamera()
    return () => {
      // Stream cleanup handled by hook
    }
  }, [initializeCamera])

  const handleCapture = async () => {
    if (capturedPreview) {
      // If already captured (e.g. uploaded), proceed
      analyzeImage(capturedPreview)
      return
    }

    const imageBlob = await captureImage()
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob)
      setCapturedPreview(url)
      analyzeImage(url)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setCapturedPreview(url)
      // Stop camera stream if uploading
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }

  const analyzeImage = async (imageUrl: string) => {
    setIsAnalyzing(true)
    console.log("Analyzing:", imageUrl)
    
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false)
      navigate('/analysis')
    }, 2500)
  }

  // Fallback for no camera access (Standard Clean UI)
  if (error && !capturedPreview) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
           <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <Camera className="w-10 h-10 text-blue-600" />
           </div>
           
           <h1 className="text-3xl font-bold text-slate-900">Camera Access Required</h1>
           <p className="text-slate-500">
             We couldn't access your camera. Please allow permissions or upload an image directly.
           </p>

           <div 
             onClick={() => fileInputRef.current?.click()}
             className="border-2 border-dashed border-slate-300 rounded-2xl p-12 hover:bg-white hover:border-blue-500 transition-all cursor-pointer group"
           >
             <Upload className="w-12 h-12 text-slate-300 group-hover:text-blue-500 mx-auto mb-4 transition-colors" />
             <p className="font-semibold text-slate-700">Upload from Gallery</p>
             <p className="text-sm text-slate-400 mt-1">JPG, PNG supported</p>
           </div>
           
           <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
           
           <button onClick={() => navigate('/')} className="text-slate-500 font-medium hover:text-slate-800 underline">
             Back to Dashboard
           </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Top Bar (Overlay) */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={() => navigate('/')} className="p-2 rounded-full bg-black/20 text-white backdrop-blur">
          <X className="w-6 h-6" />
        </button>
        <div className="flex gap-4">
          <button 
             onClick={() => setShowGuidance(!showGuidance)}
             className={cn("p-2 rounded-full backdrop-blur transition-colors", showGuidance ? "bg-blue-600 text-white" : "bg-black/20 text-white")}
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Camera View */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {capturedPreview ? (
          <img src={capturedPreview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover" 
            autoPlay 
            playsInline 
            muted 
          />
        )}
        
        {/* Guidance Overlay */}
        {!capturedPreview && showGuidance && (
          <GuidanceOverlay 
            confidence={confidence} 
            guidance={confidence > 0.8 ? 'optimal' : confidence > 0.5 ? 'adjusting' : 'searching'} 
          />
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-30">
             <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
          <div className="relative mx-auto w-20 h-20">
             <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
               <Activity className="w-10 h-10 text-blue-600" />
             </div>
             <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute inset-0 m-auto" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-4">Generating 3D depth map...</h2>
          
          {/* NOTE: p-[18px] feels better than p-4 - tested on Dr. Leena's phone */}
          {/* TODO: Flashlight breaks on Micromax Infinity (Android 11) - need BIS certification */}
          <p className="text-slate-500 p-[18px]">Analyzing skin texture and depth...</p>

             </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-black py-8 px-6 pb-safe-bottom flex flex-col gap-6">
        <ConfidenceBar confidence={confidence * 100} />
        
        <div className="flex items-center justify-between px-4">
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
           >
             <ImagePlus className="w-6 h-6" />
           </button>

           <div className="relative">
             <button 
               onClick={handleCapture}
               className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative group active:scale-95 transition-transform"
             >
               <div className="w-16 h-16 rounded-full bg-white group-hover:scale-90 transition-transform" />
             </button>
           </div>
           
           <div className="w-14" /> {/* Spacer for centering */}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
      </div>
    </div>
  )
}
