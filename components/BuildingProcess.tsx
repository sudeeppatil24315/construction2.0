'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { BUILDING_PHASES } from '@/lib/constants';
import { ProcessPhase } from '@/types';
import { useReducedMotion } from '@/lib/animations';
import ParallaxLayers from './ParallaxLayers';

// Dynamically import 3D component to avoid SSR issues
const PhaseMiniScene = dynamic(() => import('./PhaseMiniScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 rounded-lg bg-gray-950 flex items-center justify-center">
      <div className="text-gray-500 text-sm">Loading 3D scene...</div>
    </div>
  ),
});

export default function BuildingProcess() {
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [visiblePhases, setVisiblePhases] = useState<boolean[]>([false, false, false, false]);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (prefersReducedMotion) {
              // Show all phases instantly if reduced motion is preferred
              setVisiblePhases([true, true, true, true]);
            } else {
              // Animate phases sequentially
              BUILDING_PHASES.forEach((_, index) => {
                setTimeout(() => {
                  setVisiblePhases((prev) => {
                    const newState = [...prev];
                    newState[index] = true;
                    return newState;
                  });
                }, index * 300); // 300ms delay between each phase
              });
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="min-h-screen py-20 bg-black text-white relative overflow-hidden"
    >
      {/* Parallax Background Layers */}
      <ParallaxLayers />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,#D4AF37_25%,#D4AF37_50%,transparent_50%,transparent_75%,#D4AF37_75%,#D4AF37)] bg-[length:60px_60px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Our Building <span className="text-gold">Process</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A systematic approach to construction excellence, from initial planning to final handover
          </p>
        </div>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-24 left-0 right-0 h-1 bg-gray-800">
              <div
                className="h-full bg-gradient-to-r from-gold via-gold-light to-gold transition-all duration-1000"
                style={{
                  width: `${(visiblePhases.filter(Boolean).length / BUILDING_PHASES.length) * 100}%`,
                  transitionDuration: prefersReducedMotion ? '0.01ms' : '1000ms',
                }}
              />
            </div>

            {/* Phase Cards */}
            <div className="grid grid-cols-4 gap-8">
              {BUILDING_PHASES.map((phase, index) => (
                <PhaseCard
                  key={phase.id}
                  phase={phase}
                  index={index}
                  isVisible={visiblePhases[index]}
                  isActive={activePhase === index}
                  onClick={() => setActivePhase(activePhase === index ? null : index)}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Timeline - Vertical */}
        <div className="md:hidden space-y-8">
          {BUILDING_PHASES.map((phase, index) => (
            <PhaseCardMobile
              key={phase.id}
              phase={phase}
              index={index}
              isVisible={visiblePhases[index]}
              isActive={activePhase === index}
              onClick={() => setActivePhase(activePhase === index ? null : index)}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface PhaseCardProps {
  phase: ProcessPhase;
  index: number;
  isVisible: boolean;
  isActive: boolean;
  onClick: () => void;
  prefersReducedMotion: boolean;
}

function PhaseCard({ phase, index, isVisible, isActive, onClick, prefersReducedMotion }: PhaseCardProps) {
  return (
    <div
      className={`relative transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ 
        transitionDelay: prefersReducedMotion ? '0ms' : `${index * 100}ms`,
        transitionDuration: prefersReducedMotion ? '0.01ms' : '500ms',
      }}
    >
      {/* Phase Number Circle */}
      <div className="flex justify-center mb-6">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
            isVisible
              ? 'bg-gold text-black scale-100'
              : 'bg-gray-800 text-gray-600 scale-75'
          }`}
          style={{ transitionDuration: prefersReducedMotion ? '0.01ms' : '300ms' }}
        >
          {index + 1}
        </div>
      </div>

      {/* Card */}
      <div
        onClick={onClick}
        className={`bg-gray-900 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:bg-gray-800 border-2 ${
          isActive ? 'border-gold shadow-lg shadow-gold/20' : 'border-transparent'
        }`}
        style={{ transitionDuration: prefersReducedMotion ? '0.01ms' : '300ms' }}
      >
        {/* 3D Mini Scene */}
        {isActive && (
          <div className="mb-4">
            <PhaseMiniScene phaseId={index} isActive={isActive} />
          </div>
        )}

        {/* Icon */}
        <div className="text-4xl mb-4 text-center">{phase.icon}</div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gold mb-3 text-center">{phase.title}</h3>

        {/* Description */}
        <p className="text-gray-400 text-sm text-center mb-4">{phase.description}</p>

        {/* Steps - Expandable */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ transitionDuration: prefersReducedMotion ? '0.01ms' : '300ms' }}
        >
          <div className="border-t border-gray-700 pt-4 mt-4">
            <ul className="space-y-2">
              {phase.steps.map((step, stepIndex) => (
                <li
                  key={stepIndex}
                  className="flex items-start gap-2 text-sm text-gray-300"
                >
                  <span className="text-gold mt-1">✓</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Click Indicator */}
        <div className="text-center mt-4">
          <span className="text-xs text-gray-500">
            {isActive ? 'Click to collapse' : 'Click for details'}
          </span>
        </div>
      </div>
    </div>
  );
}

function PhaseCardMobile({ phase, index, isVisible, isActive, onClick, prefersReducedMotion }: PhaseCardProps) {
  return (
    <div
      className={`relative transition-all duration-500 transform ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
      }`}
      style={{ 
        transitionDelay: prefersReducedMotion ? '0ms' : `${index * 100}ms`,
        transitionDuration: prefersReducedMotion ? '0.01ms' : '500ms',
      }}
    >
      <div
        onClick={onClick}
        className={`bg-gray-900 rounded-lg p-6 cursor-pointer transition-all duration-300 border-l-4 ${
          isActive ? 'border-gold shadow-lg shadow-gold/20' : 'border-gray-700'
        }`}
        style={{ transitionDuration: prefersReducedMotion ? '0.01ms' : '300ms' }}
      >
        {/* 3D Mini Scene for Mobile */}
        {isActive && (
          <div className="mb-4">
            <PhaseMiniScene phaseId={index} isActive={isActive} />
          </div>
        )}

        <div className="flex items-start gap-4">
          {/* Phase Number */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 ${
              isVisible ? 'bg-gold text-black' : 'bg-gray-800 text-gray-600'
            }`}
          >
            {index + 1}
          </div>

          <div className="flex-1">
            {/* Icon & Title */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{phase.icon}</span>
              <h3 className="text-xl font-bold text-gold">{phase.title}</h3>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-3">{phase.description}</p>

            {/* Steps - Expandable */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
              style={{ transitionDuration: prefersReducedMotion ? '0.01ms' : '300ms' }}
            >
              <div className="border-t border-gray-700 pt-3 mt-3">
                <ul className="space-y-2">
                  {phase.steps.map((step, stepIndex) => (
                    <li
                      key={stepIndex}
                      className="flex items-start gap-2 text-sm text-gray-300"
                    >
                      <span className="text-gold mt-1">✓</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
