/**
 * Mobile Bottom Navigation Component
 * 
 * Provides thumb-friendly navigation at the bottom of the screen on mobile devices.
 * Ensures all touch targets meet the 44px minimum requirement.
 * 
 * Requirements: 8.5, 27.2, 27.5
 */

'use client';

import { useState, useEffect } from 'react';
import { NavigationSection } from '@/types';
import { smoothScrollTo } from '@/lib/utils';
import { useIsMobile } from '@/lib/breakpoints';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/lib/animations';

interface MobileBottomNavProps {
  sections: NavigationSection[];
}

export default function MobileBottomNav({ sections }: MobileBottomNavProps) {
  const [currentSection, setCurrentSection] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      // Show bottom nav after scrolling past hero section
      setIsVisible(window.scrollY > 300);

      // Detect current section
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleNavClick = (sectionId: string) => {
    smoothScrollTo(sectionId);
  };

  // Only show on mobile devices
  if (!isMobile) {
    return null;
  }

  // Navigation items optimized for mobile
  const mobileNavItems = [
    { id: 'hero', label: 'Home', icon: '🏠' },
    { id: 'services', label: 'Services', icon: '⚙️' },
    { id: 'process', label: 'Process', icon: '📋' },
    { id: 'projects', label: 'Projects', icon: '🏗️' },
    { id: 'contact', label: 'Contact', icon: '📞' },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: prefersReducedMotion ? 0 : 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: prefersReducedMotion ? 0 : 100, opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-gold/20 shadow-lg shadow-gold/10"
          style={{
            // Ensure it's above iOS Safari's bottom bar
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div className="flex items-center justify-around px-2 py-2">
            {mobileNavItems.map((item) => {
              const isActive = currentSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 rounded-lg ${
                    isActive ? 'text-gold' : 'text-gray-400'
                  }`}
                  style={{
                    // Ensure minimum 44x44px touch target
                    minWidth: '44px',
                    minHeight: '44px',
                    padding: '8px 12px',
                    // Prevent tap highlight
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    userSelect: 'none',
                  }}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Icon */}
                  <span
                    className={`text-xl transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}
                  >
                    {item.icon}
                  </span>
                  
                  {/* Label */}
                  <span
                    className={`text-xs font-medium transition-all duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-70'
                    }`}
                  >
                    {item.label}
                  </span>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-gold rounded-full"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
