'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshStandardMaterial } from 'three';
import * as THREE from 'three';

export default function BuildingModel() {
  const foundationRef = useRef<THREE.Mesh>(null);
  const wallsRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Mesh>(null);
  const [constructionProgress, setConstructionProgress] = useState(0);

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

  // Materials with PBR properties
  const goldMaterial = new MeshStandardMaterial({
    color: '#D4AF37',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#B8941F',
    emissiveIntensity: 0.1,
  });

  const concreteMaterial = new MeshStandardMaterial({
    color: '#8B8B8B',
    metalness: 0.1,
    roughness: 0.9,
  });

  const glassMaterial = new MeshStandardMaterial({
    color: '#87CEEB',
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.6,
  });

  return (
    <group position={[0, -1, 0]}>
      {/* Foundation */}
      <mesh ref={foundationRef} position={[0, -0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 4]} />
        <primitive object={concreteMaterial} attach="material" />
      </mesh>

      {/* Walls Group */}
      <group ref={wallsRef} position={[0, 0, 0]}>
        {/* Main Structure */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 3, 3.8]} />
          <primitive object={concreteMaterial} attach="material" />
        </mesh>

        {/* Windows - Front */}
        {[...Array(3)].map((_, i) => (
          <mesh key={`front-${i}`} position={[-1 + i * 1, 1.5, 1.91]} castShadow>
            <boxGeometry args={[0.6, 1.2, 0.05]} />
            <primitive object={glassMaterial} attach="material" />
          </mesh>
        ))}

        {/* Windows - Side */}
        {[...Array(3)].map((_, i) => (
          <mesh key={`side-${i}`} position={[1.91, 1.5, -1 + i * 1]} castShadow>
            <boxGeometry args={[0.05, 1.2, 0.6]} />
            <primitive object={glassMaterial} attach="material" />
          </mesh>
        ))}

        {/* Gold Accent Beams */}
        <mesh position={[-1.9, 1.5, 0]} castShadow>
          <boxGeometry args={[0.1, 3, 0.1]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
        <mesh position={[1.9, 1.5, 0]} castShadow>
          <boxGeometry args={[0.1, 3, 0.1]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.5, -1.9]} castShadow>
          <boxGeometry args={[0.1, 3, 0.1]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 1.5, 1.9]} castShadow>
          <boxGeometry args={[0.1, 3, 0.1]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
      </group>

      {/* Roof */}
      <mesh ref={roofRef} position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[2.8, 1, 4]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>

      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
    </group>
  );
}
