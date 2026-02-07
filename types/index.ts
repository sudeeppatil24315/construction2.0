// Core type definitions for SB Infra Projects Landing Page

export type QualityLevel = '3d-low' | '3d-medium' | '3d-high' | '2d-fallback';

export interface UserPreferences {
  animationsEnabled: boolean;
  soundEnabled: boolean;
  quality3D: QualityLevel;
  reducedMotion: boolean;
  hasVisitedBefore: boolean;
  lastVisit: Date | null;
}

export interface NavigationSection {
  id: string;
  label: string;
  href: string;
}

export interface ProcessPhase {
  id: string;
  title: string;
  steps: string[];
  icon: string;
  color: string;
  description: string;
}

export type ProjectCategory = 
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'infrastructure';

export interface ProjectImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  thumbnail: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  images: ProjectImage[];
  description: string;
  completionDate: string;
  location: string;
  client?: string;
  area?: string;
  duration?: string;
  has3DModel: boolean;
  modelUrl?: string;
  tags: string[];
}

export type ProjectType = 
  | 'new-construction'
  | 'renovation'
  | 'consultation'
  | 'other';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  projectType: ProjectType;
  message: string;
}
