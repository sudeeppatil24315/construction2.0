'use client';

import { useState, useRef, MouseEvent } from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  features: readonly string[];
  index: number;
}

export default function ServiceCard({
  title,
  description,
  icon,
  features,
  index,
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation based on mouse position
    // Max rotation: 15 degrees
    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = ((centerY - y) / centerY) * 15;

    setTransform({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={cardRef}
      className="relative group perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div
        className={`relative bg-gray-900 rounded-xl p-8 border-2 transition-all duration-300 ${
          isHovered
            ? 'border-gold shadow-2xl shadow-gold/30'
            : 'border-gray-800 shadow-lg'
        }`}
        style={{
          transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) ${
            isHovered ? 'translateZ(20px) scale(1.02)' : 'translateZ(0) scale(1)'
          }`,
          transition: 'transform 0.3s ease-out, border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Gold glow effect on hover */}
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br from-gold/20 via-transparent to-gold/10 opacity-0 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : ''
          }`}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div
            className={`text-6xl mb-6 transition-transform duration-300 ${
              isHovered ? 'scale-110 rotate-6' : 'scale-100'
            }`}
          >
            {icon}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gold transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 mb-6 leading-relaxed">{description}</p>

          {/* Features List */}
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-gray-300"
                style={{
                  transitionDelay: `${idx * 50}ms`,
                }}
              >
                <span className="text-gold mt-1 flex-shrink-0">✓</span>
                <span className={`transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {/* Learn More Link */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <button
              className={`text-gold font-semibold flex items-center gap-2 transition-all duration-300 ${
                isHovered ? 'translate-x-2' : ''
              }`}
            >
              Learn More
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  isHovered ? 'translate-x-1' : ''
                }`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Corner accent */}
        <div
          className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gold/20 to-transparent rounded-tr-xl transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </div>
  );
}
