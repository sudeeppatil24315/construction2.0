'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
  speed?: number;
  opacity?: number;
}

export default function ParticleSystem({
  count = 100,
  color = '#D4AF37',
  size = 0.05,
  spread = 10,
  speed = 0.5,
  opacity = 0.6,
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle positions and velocities
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Random position within spread
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 1] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = (Math.random() - 0.5) * spread;

      // Random velocity for floating effect
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = Math.random() * 0.02 + 0.01; // Upward bias
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions, velocities };
  }, [count, spread]);

  // Animate particles
  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Update positions with velocity
      positions[i3] += particles.velocities[i3] * speed;
      positions[i3 + 1] += particles.velocities[i3 + 1] * speed;
      positions[i3 + 2] += particles.velocities[i3 + 2] * speed;

      // Add subtle wave motion
      positions[i3] += Math.sin(time + i) * 0.001;
      positions[i3 + 2] += Math.cos(time + i) * 0.001;

      // Reset particles that go too far
      if (positions[i3 + 1] > spread / 2) {
        positions[i3 + 1] = -spread / 2;
      }
      if (Math.abs(positions[i3]) > spread / 2) {
        positions[i3] = (Math.random() - 0.5) * spread;
      }
      if (Math.abs(positions[i3 + 2]) > spread / 2) {
        positions[i3 + 2] = (Math.random() - 0.5) * spread;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Gentle rotation of entire particle system
    pointsRef.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
