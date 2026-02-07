'use client';

import { useState, useRef, useEffect } from 'react';
import { Project } from '@/types';
import { useReducedMotion } from '@/lib/animations';

interface ProjectCardProps {
  project: Project;
  onClick: (projectId: string) => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // Calculate transform based on reduced motion preference
  const getTransform = () => {
    if (prefersReducedMotion) {
      return 'scale(1)';
    }
    return isHovered ? 'scale(1.05) rotateX(2deg) rotateY(2deg)' : 'scale(1)';
  };

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition-all duration-300"
      style={{
        transform: getTransform(),
        transformStyle: 'preserve-3d',
        transitionDuration: prefersReducedMotion ? '0.01ms' : '300ms',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(project.id)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
        {isVisible && (
          <>
            <img
              src={project.thumbnail.url}
              alt={project.thumbnail.alt}
              loading="lazy"
              onLoad={handleImageLoad}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              } ${isHovered && !prefersReducedMotion ? 'scale-110' : 'scale-100'}`}
              style={{ transitionDuration: prefersReducedMotion ? '0.01ms' : '500ms' }}
            />
            {/* Gold Overlay on Hover */}
            <div
              className={`absolute inset-0 bg-gold transition-opacity duration-300 ${
                isHovered ? 'opacity-30' : 'opacity-0'
              }`}
              style={{ transitionDuration: prefersReducedMotion ? '0.01ms' : '300ms' }}
            />
          </>
        )}
        {!isLoaded && isVisible && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Project Details Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-6 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDuration: prefersReducedMotion ? '0.01ms' : '300ms' }}
      >
        <div className="transform transition-transform duration-300" style={{
          transform: prefersReducedMotion ? 'translateY(0)' : (isHovered ? 'translateY(0)' : 'translateY(20px)'),
          transitionDuration: prefersReducedMotion ? '0.01ms' : '300ms',
        }}>
          <span className="inline-block px-3 py-1 bg-gold text-black text-xs font-semibold rounded-full mb-2">
            {project.category.toUpperCase()}
          </span>
          <h3 className="text-white text-xl font-bold mb-2">{project.title}</h3>
          <p className="text-gray-300 text-sm mb-2 line-clamp-2">{project.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>📍 {project.location}</span>
            {project.area && <span>📐 {project.area}</span>}
          </div>
        </div>
      </div>

      {/* Gold Border Effect */}
      <div
        className={`absolute inset-0 border-2 border-gold transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          boxShadow: isHovered && !prefersReducedMotion ? '0 0 20px rgba(212, 175, 55, 0.5)' : 'none',
          transitionDuration: prefersReducedMotion ? '0.01ms' : '300ms',
        }}
      />
    </div>
  );
}
