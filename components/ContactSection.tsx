'use client';

import { useEffect, useRef, useState } from 'react';
import ContactForm from './ContactForm';
import GeometricPattern from './GeometricPattern';
import { getContainerPaddingClasses, getSectionSpacingClasses } from '@/lib/breakpoints';

export default function ContactSection() {
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

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      value: 'info@sbinfraprojects.com',
      link: 'mailto:info@sbinfraprojects.com',
    },
    {
      icon: '📞',
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: '📍',
      title: 'Address',
      value: '123 Construction Ave, Building City, BC 12345',
      link: null,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white relative overflow-hidden ${getSectionSpacingClasses()}`}
    >
      {/* Geometric Pattern */}
      <GeometricPattern variant="diamond" opacity={0.08} color="#D4AF37" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,#D4AF37_1px,transparent_1px)] bg-[length:40px_40px]"></div>
      </div>

      <div className={`container mx-auto relative z-10 ${getContainerPaddingClasses()}`}>
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Get In <span className="text-gold">Touch</span>
          </h2>
          <p
            className={`text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Ready to start your construction project? Contact us today for a free consultation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="mb-6 md:mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">Let's Build Something Amazing</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Whether you're planning a new construction project, renovation, or need expert
                consultation, our team is here to help bring your vision to life.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-800 hover:border-gold transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">
                      {info.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-400 mb-1">{info.title}</h4>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-sm sm:text-base text-white hover:text-gold transition-colors duration-300 break-words"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm sm:text-base text-white break-words">{info.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 rounded-lg border border-gray-800">
              <h4 className="text-lg sm:text-xl font-bold mb-3 md:mb-4 text-gold">Business Hours</h4>
              <div className="space-y-2 text-gray-300 text-sm sm:text-base">
                <div className="flex justify-between gap-4">
                  <span>Monday - Friday:</span>
                  <span className="font-semibold text-right">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Saturday:</span>
                  <span className="font-semibold text-right">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Sunday:</span>
                  <span className="font-semibold text-right">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className={`transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-800 shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 md:mb-6">Send Us a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Additional CTA */}
        <div
          className={`text-center mt-12 md:mt-16 px-4 transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-sm sm:text-base text-gray-400 mb-4">
            Prefer to talk? Give us a call at{' '}
            <a href="tel:+15551234567" className="text-gold hover:underline font-semibold">
              +1 (555) 123-4567
            </a>
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            We typically respond to inquiries within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}
