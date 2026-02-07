import { ProcessPhase } from '@/types';

// Brand Colors
export const COLORS = {
  gold: '#D4AF37',
  goldLight: '#E5C158',
  goldDark: '#B8941F',
  black: '#1a1a1a',
  white: '#ffffff',
} as const;

// Building Process Phases
export const BUILDING_PHASES: ProcessPhase[] = [
  {
    id: 'pre-design',
    title: 'Pre-Design',
    steps: [
      'Architect Assignment',
      'Digital Survey',
      'Soil Test'
    ],
    icon: '📐',
    color: COLORS.gold,
    description: 'Initial planning and site assessment phase'
  },
  {
    id: 'design',
    title: 'Design',
    steps: [
      '3D Floor Plan',
      'Structural Design',
      'Final Quotation',
      'Elevation Design'
    ],
    icon: '✏️',
    color: COLORS.goldLight,
    description: 'Comprehensive design and planning documentation'
  },
  {
    id: 'planning',
    title: 'Planning',
    steps: [
      'Contract/Schedule and Signing',
      'Construction Partner Allocation',
      'Project Manager Assignment'
    ],
    icon: '📋',
    color: COLORS.goldDark,
    description: 'Project setup and team coordination'
  },
  {
    id: 'execution',
    title: 'Execution',
    steps: [
      'Project Site Verification',
      'Quality Checks & Inspections',
      'Project Handover'
    ],
    icon: '🏗️',
    color: COLORS.gold,
    description: 'Construction and quality assurance'
  }
];

// Responsive Breakpoints
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

// Performance Budgets
export const PERFORMANCE = {
  maxBundleSize: 150, // KB
  targetFPS: 60,
  minFPS: 30,
  maxLoadTime: 3000, // ms
  maxFCP: 1500, // ms
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  preferences: 'sb-infra-preferences',
  visitFlag: 'sb-infra-visited',
} as const;

// Services Data
export const SERVICES = [
  {
    id: 'residential',
    title: 'Residential Construction',
    description: 'Custom homes, villas, and apartment complexes built with precision and care for modern living.',
    icon: '🏠',
    features: [
      'Custom Home Design',
      'Villa Construction',
      'Apartment Complexes',
      'Interior Finishing'
    ]
  },
  {
    id: 'commercial',
    title: 'Commercial Projects',
    description: 'Office buildings, retail spaces, and commercial complexes designed for business success.',
    icon: '🏢',
    features: [
      'Office Buildings',
      'Retail Spaces',
      'Shopping Centers',
      'Mixed-Use Developments'
    ]
  },
  {
    id: 'industrial',
    title: 'Industrial Facilities',
    description: 'Warehouses, factories, and industrial complexes built for efficiency and durability.',
    icon: '🏭',
    features: [
      'Warehouse Construction',
      'Factory Buildings',
      'Storage Facilities',
      'Industrial Parks'
    ]
  },
  {
    id: 'renovation',
    title: 'Renovation & Remodeling',
    description: 'Transform existing spaces with expert renovation and modernization services.',
    icon: '🔨',
    features: [
      'Home Renovations',
      'Office Remodeling',
      'Structural Upgrades',
      'Modernization'
    ]
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure Development',
    description: 'Roads, bridges, and public infrastructure projects that connect communities.',
    icon: '🛣️',
    features: [
      'Road Construction',
      'Bridge Building',
      'Public Facilities',
      'Urban Development'
    ]
  },
  {
    id: 'consulting',
    title: 'Construction Consulting',
    description: 'Expert guidance and project management for all phases of construction.',
    icon: '💼',
    features: [
      'Project Planning',
      'Cost Estimation',
      'Quality Assurance',
      'Site Management'
    ]
  }
] as const;

// Sample Projects Data
export const PROJECTS = [
  {
    id: 'luxury-villa-bangalore',
    title: 'Luxury Villa - Whitefield',
    category: 'residential' as const,
    thumbnail: {
      url: '/images/projects/villa-whitefield-thumb.jpg',
      alt: 'Modern luxury villa with contemporary architecture in Whitefield, Bangalore',
      width: 800,
      height: 600,
    },
    images: [
      {
        url: '/images/projects/villa-whitefield-1.jpg',
        alt: 'Front elevation of luxury villa with gold accents',
        width: 1920,
        height: 1080,
        caption: 'Contemporary front elevation with premium finishes',
      },
      {
        url: '/images/projects/villa-whitefield-2.jpg',
        alt: 'Spacious living room with floor-to-ceiling windows',
        width: 1920,
        height: 1080,
        caption: 'Open-plan living area with natural lighting',
      },
      {
        url: '/images/projects/villa-whitefield-3.jpg',
        alt: 'Modern kitchen with island and premium appliances',
        width: 1920,
        height: 1080,
        caption: 'State-of-the-art kitchen design',
      },
    ],
    description: 'A stunning 5-bedroom luxury villa featuring contemporary architecture, premium finishes, and smart home integration. Built with sustainable materials and energy-efficient systems.',
    completionDate: '2024-03-15',
    location: 'Whitefield, Bangalore',
    client: 'Private Residence',
    area: '4,500 sq ft',
    duration: '14 months',
    has3DModel: true,
    modelUrl: '/models/villa-whitefield.glb',
    tags: ['luxury', 'residential', 'smart-home', 'sustainable'],
  },
  {
    id: 'tech-park-office',
    title: 'Tech Park Office Complex',
    category: 'commercial' as const,
    thumbnail: {
      url: '/images/projects/tech-park-thumb.jpg',
      alt: 'Modern office complex with glass facade',
      width: 800,
      height: 600,
    },
    images: [
      {
        url: '/images/projects/tech-park-1.jpg',
        alt: 'Glass facade office building exterior',
        width: 1920,
        height: 1080,
        caption: 'Modern glass and steel construction',
      },
      {
        url: '/images/projects/tech-park-2.jpg',
        alt: 'Open office workspace with modern furniture',
        width: 1920,
        height: 1080,
        caption: 'Collaborative workspace design',
      },
      {
        url: '/images/projects/tech-park-3.jpg',
        alt: 'Building lobby with high ceilings',
        width: 1920,
        height: 1080,
        caption: 'Impressive entrance lobby',
      },
    ],
    description: 'A Grade-A commercial office complex spanning 200,000 sq ft with modern amenities, green building certification, and state-of-the-art infrastructure for tech companies.',
    completionDate: '2023-11-20',
    location: 'Electronic City, Bangalore',
    client: 'Tech Ventures Ltd.',
    area: '200,000 sq ft',
    duration: '24 months',
    has3DModel: false,
    tags: ['commercial', 'office', 'green-building', 'tech'],
  },
  {
    id: 'industrial-warehouse',
    title: 'Logistics Warehouse Facility',
    category: 'industrial' as const,
    thumbnail: {
      url: '/images/projects/warehouse-thumb.jpg',
      alt: 'Large industrial warehouse with loading docks',
      width: 800,
      height: 600,
    },
    images: [
      {
        url: '/images/projects/warehouse-1.jpg',
        alt: 'Exterior view of warehouse with multiple loading bays',
        width: 1920,
        height: 1080,
        caption: 'Efficient loading dock design',
      },
      {
        url: '/images/projects/warehouse-2.jpg',
        alt: 'Interior warehouse space with high ceilings',
        width: 1920,
        height: 1080,
        caption: 'Spacious interior with optimal storage capacity',
      },
    ],
    description: 'A modern logistics warehouse with automated systems, climate control, and efficient material handling infrastructure. Designed for maximum storage capacity and operational efficiency.',
    completionDate: '2024-01-10',
    location: 'Hosur Road, Bangalore',
    client: 'LogiTech Solutions',
    area: '150,000 sq ft',
    duration: '18 months',
    has3DModel: false,
    tags: ['industrial', 'warehouse', 'logistics', 'automated'],
  },
  {
    id: 'heritage-renovation',
    title: 'Heritage Building Restoration',
    category: 'residential' as const,
    thumbnail: {
      url: '/images/projects/heritage-thumb.jpg',
      alt: 'Restored heritage building with colonial architecture',
      width: 800,
      height: 600,
    },
    images: [
      {
        url: '/images/projects/heritage-1.jpg',
        alt: 'Restored facade of heritage building',
        width: 1920,
        height: 1080,
        caption: 'Carefully restored colonial architecture',
      },
      {
        url: '/images/projects/heritage-2.jpg',
        alt: 'Interior with restored wooden beams and modern amenities',
        width: 1920,
        height: 1080,
        caption: 'Blend of heritage charm and modern comfort',
      },
      {
        url: '/images/projects/heritage-3.jpg',
        alt: 'Restored courtyard with traditional elements',
        width: 1920,
        height: 1080,
        caption: 'Traditional courtyard design preserved',
      },
    ],
    description: 'Meticulous restoration of a 100-year-old heritage building, preserving original architectural elements while integrating modern amenities and safety standards.',
    completionDate: '2023-09-05',
    location: 'Basavanagudi, Bangalore',
    client: 'Heritage Trust',
    area: '6,000 sq ft',
    duration: '20 months',
    has3DModel: true,
    modelUrl: '/models/heritage-building.glb',
    tags: ['heritage', 'restoration', 'residential', 'conservation'],
  },
  {
    id: 'apartment-complex',
    title: 'Green Valley Apartments',
    category: 'residential' as const,
    thumbnail: {
      url: '/images/projects/apartments-thumb.jpg',
      alt: 'Modern apartment complex with landscaping',
      width: 800,
      height: 600,
    },
    images: [
      {
        url: '/images/projects/apartments-1.jpg',
        alt: 'Apartment complex exterior with balconies',
        width: 1920,
        height: 1080,
        caption: 'Contemporary apartment design with green spaces',
      },
      {
        url: '/images/projects/apartments-2.jpg',
        alt: 'Clubhouse and swimming pool area',
        width: 1920,
        height: 1080,
        caption: 'Premium amenities for residents',
      },
      {
        url: '/images/projects/apartments-3.jpg',
        alt: 'Sample apartment interior',
        width: 1920,
        height: 1080,
        caption: 'Spacious 3BHK apartment layout',
      },
    ],
    description: 'A 120-unit residential complex with 2BHK and 3BHK apartments, featuring modern amenities including clubhouse, swimming pool, gym, and landscaped gardens.',
    completionDate: '2024-02-28',
    location: 'Sarjapur Road, Bangalore',
    client: 'Green Valley Developers',
    area: '180,000 sq ft',
    duration: '22 months',
    has3DModel: false,
    tags: ['residential', 'apartments', 'amenities', 'gated-community'],
  },
  {
    id: 'retail-mall',
    title: 'City Center Shopping Mall',
    category: 'commercial' as const,
    thumbnail: {
      url: '/images/projects/mall-thumb.jpg',
      alt: 'Modern shopping mall with glass atrium',
      width: 800,
      height: 600,
    },
    images: [
      {
        url: '/images/projects/mall-1.jpg',
        alt: 'Mall exterior with modern architecture',
        width: 1920,
        height: 1080,
        caption: 'Striking contemporary design',
      },
      {
        url: '/images/projects/mall-2.jpg',
        alt: 'Interior atrium with natural lighting',
        width: 1920,
        height: 1080,
        caption: 'Spacious atrium with skylight',
      },
      {
        url: '/images/projects/mall-3.jpg',
        alt: 'Food court area with seating',
        width: 1920,
        height: 1080,
        caption: 'Modern food court design',
      },
    ],
    description: 'A three-level shopping mall with 100+ retail outlets, multiplex cinema, food court, and entertainment zone. Features energy-efficient systems and ample parking.',
    completionDate: '2023-12-15',
    location: 'MG Road, Bangalore',
    client: 'City Center Retail Pvt Ltd',
    area: '250,000 sq ft',
    duration: '28 months',
    has3DModel: true,
    modelUrl: '/models/shopping-mall.glb',
    tags: ['commercial', 'retail', 'mall', 'entertainment'],
  },
  {
    id: 'bridge-infrastructure',
    title: 'Outer Ring Road Flyover',
    category: 'infrastructure' as const,
    thumbnail: {
      url: '/images/projects/bridge-thumb.jpg',
      alt: 'Modern flyover bridge construction',
      width: 800,
      height: 600,
    },
    images: [
      {
        url: '/images/projects/bridge-1.jpg',
        alt: 'Completed flyover with multiple lanes',
        width: 1920,
        height: 1080,
        caption: 'Six-lane flyover reducing traffic congestion',
      },
      {
        url: '/images/projects/bridge-2.jpg',
        alt: 'Bridge support structure',
        width: 1920,
        height: 1080,
        caption: 'Robust structural engineering',
      },
    ],
    description: 'A 2.5 km six-lane flyover designed to ease traffic congestion on the Outer Ring Road. Features advanced drainage systems and LED lighting for safety.',
    completionDate: '2023-10-30',
    location: 'Outer Ring Road, Bangalore',
    client: 'Bangalore Development Authority',
    area: '2.5 km length',
    duration: '30 months',
    has3DModel: false,
    tags: ['infrastructure', 'bridge', 'public-works', 'transportation'],
  },
  {
    id: 'factory-expansion',
    title: 'Manufacturing Plant Expansion',
    category: 'industrial' as const,
    thumbnail: {
      url: '/images/projects/factory-thumb.jpg',
      alt: 'Industrial manufacturing facility',
      width: 800,
      height: 600,
    },
    images: [
      {
        url: '/images/projects/factory-1.jpg',
        alt: 'Factory exterior with modern design',
        width: 1920,
        height: 1080,
        caption: 'Expanded production facility',
      },
      {
        url: '/images/projects/factory-2.jpg',
        alt: 'Interior production floor',
        width: 1920,
        height: 1080,
        caption: 'State-of-the-art manufacturing floor',
      },
    ],
    description: 'Expansion of an existing manufacturing plant with new production lines, quality control labs, and administrative offices. Includes sustainable energy solutions.',
    completionDate: '2024-04-20',
    location: 'Peenya Industrial Area, Bangalore',
    client: 'AutoTech Manufacturing',
    area: '80,000 sq ft',
    duration: '16 months',
    has3DModel: false,
    tags: ['industrial', 'manufacturing', 'expansion', 'sustainable'],
  },
];
