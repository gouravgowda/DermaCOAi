import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { cn } from '@/lib/utils'

interface Wound3DViewerProps {
  className?: string
}

export default function Wound3DViewer({ className }: Wound3DViewerProps) {
  return (
    <div className={cn("relative w-full h-full", className)}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#20C9D2" />
        <pointLight position={[-3, 3, -3]} intensity={0.3} color="#3387BF" />
        <mesh rotation={[-Math.PI / 4, 0, 0]}>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <meshPhysicalMaterial
            color="#0A0E1A"
            metalness={0.4}
            roughness={0.2}
            transmission={0.3}
            thickness={1}
            envMapIntensity={0.5}
          />
        </mesh>
        <gridHelper args={[10, 10, '#1A2440', '#151D35']} position={[0, -1.5, 0]} />
        <OrbitControls enableZoom enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
