'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { detectDeviceCapabilities, getLODSettings, getGeometrySegments, getOptimalDPR } from '@/lib/device-detector';

interface PhaseMiniSceneProps {
  phaseId: number;
  isActive: boolean;
  quality?: '2d-fallback' | '3d-low' | '3d-medium' | '3d-high';
}

export default function PhaseMiniScene({ phaseId, isActive, quality }: PhaseMiniSceneProps) {
  const [deviceCaps, setDeviceCaps] = useState(() => detectDeviceCapabilities());
  const effectiveQuality = quality || deviceCaps.recommendedQuality;
  const lodSettings = getLODSettings(effectiveQuality, deviceCaps.devicePixelRatio);
  const optimalDPR = getOptimalDPR();

  useEffect(() => {
    setDeviceCaps(detectDeviceCapabilities());
  }, []);

  return (
    <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-950">
      <Canvas
        camera={{ position: [3, 3, 3], fov: 50 }}
        gl={{ 
          antialias: lodSettings.antialias, 
          alpha: true,
          powerPreference: deviceCaps.isMobile ? 'low-power' : 'default',
        }}
        dpr={optimalDPR}
      >
        <ambientLight intensity={0.3} />
        {lodSettings.maxLights >= 2 && (
          <>
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#D4AF37" />
          </>
        )}
        
        {phaseId === 0 && <PreDesignScene isActive={isActive} lodSettings={lodSettings} />}
        {phaseId === 1 && <DesignScene isActive={isActive} lodSettings={lodSettings} />}
        {phaseId === 2 && <PlanningScene isActive={isActive} lodSettings={lodSettings} />}
        {phaseId === 3 && <ExecutionScene isActive={isActive} lodSettings={lodSettings} />}
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={isActive && !deviceCaps.isMobile}
          autoRotateSpeed={2}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

// Pre-Design Phase: Survey equipment and site markers
function PreDesignScene({ isActive, lodSettings }: { isActive: boolean; lodSettings: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const segments = getGeometrySegments(lodSettings.geometryDetail);

  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Survey markers */}
      {[
        [-1, 0, -1],
        [1, 0, -1],
        [-1, 0, 1],
        [1, 0, 1],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.6, segments.cylinder[0]]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <coneGeometry args={[0.1, 0.15, segments.cone]} />
            <meshStandardMaterial color="#ff4444" emissive="#ff0000" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Measuring tape/ruler */}
      <mesh position={[0, 0.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[2, 0.05, 0.15]} />
        <meshStandardMaterial color="#ffcc00" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Design Phase: Blueprint and 3D model
function DesignScene({ isActive, lodSettings }: { isActive: boolean; lodSettings: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const blueprintRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
    if (blueprintRef.current) {
      blueprintRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Blueprint/paper */}
      <mesh ref={blueprintRef} position={[0, 0, 0]} rotation={[-Math.PI / 3, 0, 0]}>
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial color="#1a4d7a" side={THREE.DoubleSide} />
      </mesh>

      {/* Grid lines on blueprint */}
      <lineSegments position={[0, 0.01, 0]} rotation={[-Math.PI / 3, 0, 0]}>
        <edgesGeometry
          attach="geometry"
          args={[new THREE.PlaneGeometry(2, 1.5, 8, 6)]}
        />
        <lineBasicMaterial attach="material" color="#D4AF37" opacity={0.6} transparent />
      </lineSegments>

      {/* 3D building wireframe */}
      <group position={[0, 0.8, 0]} scale={0.6}>
        <lineSegments>
          <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1.5, 1)]} />
          <lineBasicMaterial attach="material" color="#D4AF37" linewidth={2} />
        </lineSegments>
      </group>

      {/* Pencil */}
      <group position={[0.8, 0.2, 0.5]} rotation={[0, 0, -Math.PI / 6]}>
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 0.8, lodSettings.geometryDetail === 'low' ? 4 : 6]} />
          <meshStandardMaterial color="#ffcc00" />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <coneGeometry args={[0.03, 0.1, lodSettings.geometryDetail === 'low' ? 4 : 6]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
    </group>
  );
}

// Planning Phase: Calendar, documents, and checklist
function PlanningScene({ isActive, lodSettings }: { isActive: boolean; lodSettings: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const pagesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
    if (pagesRef.current) {
      pagesRef.current.children.forEach((child, i) => {
        child.position.y = 0.1 + i * 0.05 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.02;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Calendar/document stack */}
      <group ref={pagesRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0.1 + i * 0.05, 0]} rotation={[-Math.PI / 6, 0, 0]}>
            <boxGeometry args={[1.5, 0.02, 1.2]} />
            <meshStandardMaterial
              color={i === 0 ? '#ffffff' : i === 1 ? '#f0f0f0' : '#e8e8e8'}
            />
          </mesh>
        ))}
      </group>

      {/* Checkmarks */}
      {[
        [-0.4, 0.3, 0.2],
        [0, 0.35, 0.3],
        [0.4, 0.4, 0.4],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <torusGeometry args={[0.08, 0.02, lodSettings.geometryDetail === 'low' ? 6 : 8, lodSettings.geometryDetail === 'low' ? 12 : 16]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Clipboard */}
      <mesh position={[0, 0.5, -0.3]}>
        <boxGeometry args={[0.1, 0.3, 0.02]} />
        <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Execution Phase: Construction site with crane and building
function ExecutionScene({ isActive, lodSettings }: { isActive: boolean; lodSettings: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const craneRef = useRef<THREE.Group>(null);
  const segments = getGeometrySegments(lodSettings.geometryDetail);

  useFrame((state) => {
    if (craneRef.current && isActive) {
      craneRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>

      {/* Building under construction */}
      <group position={[0, 0, 0]}>
        {/* Foundation */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[1.2, 0.2, 1.2]} />
          <meshStandardMaterial color="#666666" />
        </mesh>

        {/* Walls (partial) */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 0.6, 1]} />
          <meshStandardMaterial color="#cccccc" transparent opacity={0.8} />
        </mesh>

        {/* Scaffolding */}
        <lineSegments position={[0, 0.5, 0]}>
          <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1.3, 0.8, 1.3)]} />
          <lineBasicMaterial attach="material" color="#D4AF37" linewidth={2} />
        </lineSegments>
      </group>

      {/* Crane */}
      <group ref={craneRef} position={[1.2, 0, 0]}>
        {/* Crane base */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.6, segments.cylinder[0]]} />
          <meshStandardMaterial color="#ff6600" />
        </mesh>

        {/* Crane arm */}
        <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 12]}>
          <boxGeometry args={[1, 0.05, 0.05]} />
          <meshStandardMaterial color="#ffcc00" />
        </mesh>

        {/* Hook */}
        <mesh position={[0.3, 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, segments.cylinder[0]]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>

      {/* Safety cones */}
      {[
        [-1, 0, -1],
        [1, 0, -1],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <coneGeometry args={[0.1, 0.2, segments.cone]} />
          <meshStandardMaterial
            color="#ff6600"
            emissive="#ff3300"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
