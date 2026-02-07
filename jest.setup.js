import '@testing-library/jest-dom'

// Mock matchMedia for GSAP
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver for Three.js Canvas
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock Next.js dynamic imports
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (...args) => {
    const dynamicModule = jest.requireActual('next/dynamic');
    const dynamicActualComp = dynamicModule.default;
    const RequiredComponent = dynamicActualComp(args[0]);
    RequiredComponent.preload ? RequiredComponent.preload() : RequiredComponent.render.preload();
    return RequiredComponent;
  },
}));

// Mock PhaseMiniScene component to avoid Three.js rendering in tests
jest.mock('./components/PhaseMiniScene', () => {
  return function MockPhaseMiniScene({ phaseId, isActive }) {
    return (
      <div data-testid={`phase-mini-scene-${phaseId}`} data-active={isActive}>
        3D Scene for Phase {phaseId}
      </div>
    );
  };
});
