'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavigationSection } from '@/types';
import { smoothScrollTo } from '@/lib/utils';
import { useReducedMotion, easings } from '@/lib/animations';

interface NavigationProps {
  sections: NavigationSection[];
}

export default function Navigation({ sections }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleNavClick = (sectionId: string) => {
    smoothScrollTo(sectionId);
    setIsMobileMenuOpen(false);
  };

  // Animation variants for page load
  const navVariants = {
    initial: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.6,
        ease: easings.easeOut as any,
      },
    },
  };

  const logoVariants = {
    initial: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : -20,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.6,
        delay: prefersReducedMotion ? 0 : 0.1,
        ease: easings.easeOut as any,
      },
    },
  };

  const menuItemsVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const menuItemVariants = {
    initial: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.4,
        ease: easings.easeOut as any,
      },
    },
  };

  return (
    <motion.nav
      initial="initial"
      animate="animate"
      variants={navVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div variants={logoVariants} className="flex-shrink-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gold">
              SB INFRA
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            variants={menuItemsVariants}
            className="hidden md:flex items-center space-x-8"
          >
            {sections.map((section) => (
              <motion.button
                key={section.id}
                variants={menuItemVariants}
                onClick={() => handleNavClick(section.id)}
                className={`text-sm lg:text-base font-medium transition-colors duration-200 hover:text-gold ${
                  currentSection === section.id ? 'text-gold' : 'text-white'
                }`}
              >
                {section.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            variants={menuItemVariants}
            className="md:hidden text-white hover:text-gold transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="bg-black/95 backdrop-blur-md px-4 py-4 space-y-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleNavClick(section.id)}
              className={`block w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                currentSection === section.id
                  ? 'bg-gold/20 text-gold'
                  : 'text-white hover:bg-gold/10 hover:text-gold'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
