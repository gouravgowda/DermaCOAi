import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Spinner } from '@/components/atoms/Spinner'

interface DepthMapProps {
  className?: string
}

/**
 * DepthMesh – procedural depth-mapped plane that visualizes wound topology
 * Reduced to 32×32 segments to prevent memory issues on mobile
 */
function DepthMesh() {
  const meshRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {
    const segments = 32 // Reduced from 64 to prevent crashes
    const geo = new THREE.PlaneGeometry(5, 5, segments, segments)
    const positions = geo.attributes.position
    const colors = new Float32Array(positions.count * 3)

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)

      const distFromCenter = Math.sqrt(x * x + y * y)
      const woundRadius = 1.2
      const noise = Math.sin(distFromCenter * 3 + x * 2) * 0.15
      const depth =
        distFromCenter < woundRadius + noise
          ? -0.5 * Math.cos((distFromCenter / (woundRadius + noise)) * Math.PI * 0.5)
          : 0

      positions.setZ(i, depth + (Math.random() - 0.5) * 0.02)

      const normalizedDepth = Math.abs(depth) / 0.5
      colors[i * 3] = normalizedDepth > 0.5 ? 1 : normalizedDepth * 2
      colors[i * 3 + 1] = normalizedDepth < 0.5 ? 0.8 : 1 - normalizedDepth
      colors[i * 3 + 2] = 0.3 * (1 - normalizedDepth)
    }

    geo.computeVertexNormals()
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  // Gentle auto-rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
  })

  // Cleanup on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (meshRef.current) {
        meshRef.current.geometry.dispose()
        const mat = meshRef.current.material
        if (Array.isArray(mat)) {
          mat.forEach((m) => m.dispose())
        } else {
          mat.dispose()
        }
      }
    }
  }, [])

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-0.6, 0, 0]}>
      <meshStandardMaterial
        vertexColors
        side={THREE.DoubleSide}
        flatShading
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  )
}

export function DepthMap({ className }: DepthMapProps) {
  return (
    <div className={`relative rounded-xl overflow-hidden bg-medical-blue ${className || 'h-64'}`}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <Spinner size="lg" />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 3, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          frameloop="demand" // Only render on interaction, saves GPU
          onCreated={({ gl }) => {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-3, 3, 2]} intensity={0.5} color="#00C6CF" />
          <DepthMesh />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minDistance={3}
            maxDistance={8}
          />
        </Canvas>
      </Suspense>

      {/* Overlay labels */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between">
        <div className="px-2 py-1 rounded bg-black/40 backdrop-blur-sm">
          <span className="text-[10px] text-white/70">3D Wound Topology</span>
        </div>
        <div className="flex gap-1.5 items-center">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-risk-high" />
            <span className="text-[9px] text-white/60">Deep</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-risk-medium" />
            <span className="text-[9px] text-white/60">Mid</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-risk-low" />
            <span className="text-[9px] text-white/60">Surface</span>
          </div>
        </div>
      </div>
    </div>
  )
}
