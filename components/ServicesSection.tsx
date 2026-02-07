'use client';

import { useEffect, useRef, useState } from 'react';
import ServiceCard from './ServiceCard';
import GeometricPattern from './GeometricPattern';
import { SERVICES } from '@/lib/constants';
import { getContainerPaddingClasses, getSectionSpacingClasses } from '@/lib/breakpoints';

export default function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className={`min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white relative overflow-hidden ${getSectionSpacingClasses()}`}
    >
      {/* Geometric Pattern */}
      <GeometricPattern variant="hexagon" opacity={0.06} color="#D4AF37" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,#D4AF37_1px,transparent_1px)] bg-[length:50px_50px]"></div>
      </div>

      <div className={`container mx-auto relative z-10 ${getContainerPaddingClasses()}`}>
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            Our <span className="text-gold">Services</span>
          </h2>
          <p
            className={`text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 transition-all duration-1000 delay-200 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            Comprehensive construction solutions tailored to your needs, from concept to completion
          </p>
        </div>

        {/* Services Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {SERVICES.map((service, index) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              features={service.features}
              index={index}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div
          className={`text-center mt-12 md:mt-16 px-4 transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-sm sm:text-base text-gray-400 mb-4 md:mb-6">
            Don't see what you're looking for? We offer custom solutions for unique projects.
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gold text-black font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold/50 text-sm sm:text-base"
          >
            Discuss Your Project
          </button>
        </div>
      </div>
    </section>
  );
}
