'use client';

import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import BuildingProcess from '@/components/BuildingProcess';
import ProjectsShowcase from '@/components/ProjectsShowcase';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import PageLoadAnimator from '@/components/PageLoadAnimator';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Page load animation sequence - animates sections top to bottom with natural easing */}
      <PageLoadAnimator delay={0.2} staggerDelay={0.15}>
        {/* Hero Section with 3D Scene */}
        <PageLoadAnimator.Item>
          <HeroSection />
        </PageLoadAnimator.Item>

        {/* Services Section */}
        <PageLoadAnimator.Item>
          <ServicesSection />
        </PageLoadAnimator.Item>

        {/* Building Process Section */}
        <PageLoadAnimator.Item>
          <BuildingProcess />
        </PageLoadAnimator.Item>

        {/* Projects Section */}
        <PageLoadAnimator.Item>
          <ProjectsShowcase />
        </PageLoadAnimator.Item>

        {/* About Section */}
        <PageLoadAnimator.Item>
          <AboutSection />
        </PageLoadAnimator.Item>

        {/* Contact Section */}
        <PageLoadAnimator.Item>
          <ContactSection />
        </PageLoadAnimator.Item>
      </PageLoadAnimator>
    </div>
  );
}
