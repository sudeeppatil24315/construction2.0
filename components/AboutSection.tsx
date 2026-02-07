'use client';

import { useEffect, useRef, useState } from 'react';
import AnimatedCounter from './AnimatedCounter';
import ParticleBackground from './ParticleBackground';
import { getContainerPaddingClasses, getSectionSpacingClasses } from '@/lib/breakpoints';

export default function AboutSection() {
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

  const stats = [
    { value: 500, suffix: '+', label: 'Projects Completed', delay: 0 },
    { value: 15, suffix: '+', label: 'Years Experience', delay: 200 },
    { value: 100, suffix: '%', label: 'Client Satisfaction', delay: 400 },
    { value: 50, suffix: '+', label: 'Expert Team Members', delay: 600 },
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Our Mission',
      description:
        'To deliver exceptional construction services that exceed expectations, building lasting relationships through quality, innovation, and integrity.',
    },
    {
      icon: '👁️',
      title: 'Our Vision',
      description:
        'To be the most trusted construction partner, recognized for transforming spaces and communities through sustainable, innovative building solutions.',
    },
    {
      icon: '⭐',
      title: 'Our Values',
      description:
        'Excellence, Integrity, Innovation, Safety, and Sustainability guide every decision we make and every project we undertake.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`min-h-screen bg-white text-black relative overflow-hidden ${getSectionSpacingClasses()}`}
    >
      {/* Particle Background */}
      <ParticleBackground count={30} color="#D4AF37" maxSize={2} speed={0.3} />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent_24%,#D4AF37_25%,#D4AF37_26%,transparent_27%,transparent_74%,#D4AF37_75%,#D4AF37_76%,transparent_77%,transparent)] bg-[length:50px_50px]"></div>
      </div>

      <div className={`container mx-auto relative z-10 ${getContainerPaddingClasses()}`}>
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            About <span className="text-gold">Us</span>
          </h2>
          <p
            className={`text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto px-4 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Building excellence through innovation, quality craftsmanship, and unwavering commitment
            to our clients' vision
          </p>
        </div>

        {/* Company Story */}
        <div
          className={`max-w-4xl mx-auto mb-16 md:mb-20 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 md:mb-6">
              <span className="text-gold font-bold text-xl sm:text-2xl">SB Infra Projects</span> is a leading
              construction company with over 15 years of experience in delivering exceptional
              building solutions. From residential homes to large-scale commercial developments, we
              bring expertise, innovation, and dedication to every project.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Our team of skilled professionals combines traditional craftsmanship with modern
              technology to create spaces that inspire, function beautifully, and stand the test of
              time. We pride ourselves on our attention to detail, commitment to quality, and
              ability to turn our clients' visions into reality.
            </p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-16 md:mb-20 transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 sm:p-6 bg-gradient-to-br from-black to-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${stat.delay}ms` }}
            >
              <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2000} />
              <div className="text-gray-300 mt-2 md:mt-3 text-xs sm:text-sm md:text-base font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission, Vision, Values */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gold group"
            >
              <div className="text-4xl sm:text-5xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                {value.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4 text-black group-hover:text-gold transition-colors duration-300">
                {value.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div
          className={`text-center mt-12 md:mt-16 px-4 transition-all duration-1000 delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-gray-600 mb-4 md:mb-6 text-base sm:text-lg">
            Ready to start your construction project with a trusted partner?
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gold text-black font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold/50 text-sm sm:text-base"
          >
            Let's Build Together
          </button>
        </div>
      </div>
    </section>
  );
}
