'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshStandardMaterial } from 'three';
import * as THREE from 'three';
import { detectDeviceCapabilities, getLODSettings, getGeometrySegments } from '@/lib/device-detector';

interface BuildingModelProps {
  quality?: '2d-fallback' | '3d-low' | '3d-medium' | '3d-high';
}

export default function BuildingModel({ quality }: BuildingModelProps) {
  const foundationRef = useRef<THREE.Mesh>(null);
  const wallsRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Mesh>(null);
  const [constructionProgress, setConstructionProgress] = useState(0);

  // Detect device capabilities and get LOD settings
  const deviceCaps = detectDeviceCapabilities();
  const effectiveQuality = quality || deviceCaps.recommendedQuality;
  const lodSettings = getLODSettings(effectiveQuality, deviceCaps.devicePixelRatio);
  const geometrySegments = getGeometrySegments(lodSettings.geometryDetail);

  // Scroll-based construction animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      // Progress from 0 to 1 based on first screen scroll
      const progress = Math.min(scrollPosition / windowHeight, 1);
      setConstructionProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate construction based on scroll
  useFrame(() => {
    if (foundationRef.current) {
      // Foundation appears first (0-0.3)
      const foundationProgress = Math.min(constructionProgress / 0.3, 1);
      foundationRef.current.scale.y = foundationProgress;
      foundationRef.current.position.y = -1 + foundationProgress * 0.5;
    }

    if (wallsRef.current) {
      // Walls appear next (0.3-0.7)
      const wallsProgress = Math.max(0, Math.min((constructionProgress - 0.3) / 0.4, 1));
      wallsRef.current.scale.y = wallsProgress;
      wallsRef.current.position.y = wallsProgress * 1.5;
    }

    if (roofRef.current) {
      // Roof appears last (0.7-1.0)
      const roofProgress = Math.max(0, Math.min((constructionProgress - 0.7) / 0.3, 1));
      roofRef.current.scale.set(roofProgress, roofProgress, roofProgress);
      roofRef.current.position.y = 3 + roofProgress * 0.5;
    }
  });

  // Materials with PBR properties - adjusted based on quality level
  const goldMaterial = new MeshStandardMaterial({
    color: '#D4AF37',
    metalness: lodSettings.enableReflections ? 0.8 : 0.5,
    roughness: lodSettings.enableReflections ? 0.2 : 0.4,
    emissive: '#B8941F',
    emissiveIntensity: lodSettings.geometryDetail === 'high' ? 0.1 : 0.05,
  });

  const concreteMaterial = new MeshStandardMaterial({
    color: '#8B8B8B',
    metalness: 0.1,
    roughness: 0.9,
  });

  const glassMaterial = new MeshStandardMaterial({
    color: '#87CEEB',
    metalness: lodSettings.enableReflections ? 0.9 : 0.5,
    roughness: lodSettings.enableReflections ? 0.1 : 0.3,
    transparent: lodSettings.geometryDetail !== 'low',
    opacity: lodSettings.geometryDetail !== 'low' ? 0.6 : 1,
  });

  // Determine if we should render windows based on quality
  const shouldRenderWindows = lodSettings.geometryDetail !== 'low';
  const windowCount = lodSettings.geometryDetail === 'high' ? 3 : 2;

  return (
    <group position={[0, -1, 0]}>
      {/* Foundation */}
      <mesh 
        ref={foundationRef} 
        position={[0, -0.5, 0]} 
        castShadow={lodSettings.shadowQuality !== 'none'} 
        receiveShadow={lodSettings.shadowQuality !== 'none'}
      >
        <boxGeometry args={[4, 1, 4, ...geometrySegments.box]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      {/* Walls Group */}
      <group ref={wallsRef} position={[0, 0, 0]}>
        {/* Main Structure */}
        <mesh 
          position={[0, 1.5, 0]} 
          castShadow={lodSettings.shadowQuality !== 'none'} 
          receiveShadow={lodSettings.shadowQuality !== 'none'}
        >
          <boxGeometry args={[3.8, 3, 3.8, ...geometrySegments.box]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>

        {/* Windows - Front (only render if quality allows) */}
        {shouldRenderWindows && [...Array(windowCount)].map((_, i) => (
          <mesh 
            key={`front-${i}`} 
            position={[-1 + i * 1, 1.5, 1.91]} 
            castShadow={lodSettings.shadowQuality === 'high'}
          >
            <boxGeometry args={[0.6, 1.2, 0.05]} />
            <primitive object={glassMaterial} attach="material" />
          </mesh>
        ))}

        {/* Windows - Side (only render if quality allows) */}
        {shouldRenderWindows && [...Array(windowCount)].map((_, i) => (
          <mesh 
            key={`side-${i}`} 
            position={[1.91, 1.5, -1 + i * 1]} 
            castShadow={lodSettings.shadowQuality === 'high'}
          >
            <boxGeometry args={[0.05, 1.2, 0.6]} />
            <primitive object={glassMaterial} attach="material" />
          </mesh>
        ))}

        {/* Gold Accent Beams */}
        <mesh 
          position={[-1.9, 1.5, 0]} 
          castShadow={lodSettings.shadowQuality !== 'none'}
        >
          <boxGeometry args={[0.1, 3, 0.1]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
        <mesh 
          position={[1.9, 1.5, 0]} 
          castShadow={lodSettings.shadowQuality !== 'none'}
        >
          <boxGeometry args={[0.1, 3, 0.1]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
        <mesh 
          position={[0, 1.5, -1.9]} 
          castShadow={lodSettings.shadowQuality !== 'none'}
        >
          <boxGeometry args={[0.1, 3, 0.1]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
        <mesh 
          position={[0, 1.5, 1.9]} 
          castShadow={lodSettings.shadowQuality !== 'none'}
        >
          <boxGeometry args={[0.1, 3, 0.1]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
      </group>

      {/* Roof */}
      <mesh 
        ref={roofRef} 
        position={[0, 3.5, 0]} 
        castShadow={lodSettings.shadowQuality !== 'none'}
      >
        <coneGeometry args={[2.8, 1, geometrySegments.cone]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>

      {/* Ground Plane */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 0]} 
        receiveShadow={lodSettings.shadowQuality !== 'none'}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
    </group>
  );
}
