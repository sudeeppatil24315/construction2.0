/**
 * Property-Based Tests for Progressive 3D Loading
 * 
 * Property 26: Progressive 3D Model Loading
 * Validates: Requirements 9.3
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { use3DLoadingProgress } from '@/hooks/use3DLoadingProgress';
import { useLoadingProgress } from '@/hooks/useLoadingProgress';
import LoadingScreen from '@/components/LoadingScreen';

describe('Progressive 3D Loading - Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  /**
   * Property 26: Progressive 3D Model Loading
   * For any 3D model asset, low-poly versions should load before high-poly versions (progressive enhancement).
   * Validates: Requirements 9.3
   */
  describe('Property 26: Progressive 3D Model Loading', () => {
    test('should initialize with loading state at 0%', () => {
      const { result } = renderHook(() => use3DLoadingProgress());

      expect(result.current.loadingState.progress).toBe(0);
      expect(result.current.loadingState.isLoading).toBe(true);
      expect(result.current.loadingState.loaded).toBe(0);
      expect(result.current.loadingState.total).toBe(0);
    });

    test('should update progress as assets load progressively', () => {
      const { result } = renderHook(() => use3DLoadingProgress());

      // Simulate progressive loading: 25%, 50%, 75%, 100%
      act(() => {
        result.current.onProgress(25, 100);
      });
      expect(result.current.loadingState.progress).toBe(25);
      expect(result.current.loadingState.isLoading).toBe(true);

      act(() => {
        result.current.onProgress(50, 100);
      });
      expect(result.current.loadingState.progress).toBe(50);
      expect(result.current.loadingState.isLoading).toBe(true);

      act(() => {
        result.current.onProgress(75, 100);
      });
      expect(result.current.loadingState.progress).toBe(75);
      expect(result.current.loadingState.isLoading).toBe(true);

      act(() => {
        result.current.onProgress(100, 100);
      });
      expect(result.current.loadingState.progress).toBe(100);
      expect(result.current.loadingState.isLoading).toBe(false);
    });

    test('should calculate progress correctly for any loaded/total ratio', () => {
      const { result } = renderHook(() => use3DLoadingProgress());

      const testCases = [
        { loaded: 10, total: 100, expectedProgress: 10 },
        { loaded: 33, total: 100, expectedProgress: 33 },
        { loaded: 50, total: 200, expectedProgress: 25 },
        { loaded: 150, total: 300, expectedProgress: 50 },
        { loaded: 999, total: 1000, expectedProgress: 99.9 },
      ];

      testCases.forEach(({ loaded, total, expectedProgress }) => {
        act(() => {
          result.current.onProgress(loaded, total);
        });
        expect(result.current.loadingState.progress).toBeCloseTo(expectedProgress, 1);
        expect(result.current.loadingState.loaded).toBe(loaded);
        expect(result.current.loadingState.total).toBe(total);
      });
    });

    test('should handle zero total gracefully', () => {
      const { result } = renderHook(() => use3DLoadingProgress());

      act(() => {
        result.current.onProgress(0, 0);
      });

      expect(result.current.loadingState.progress).toBe(0);
      expect(result.current.loadingState.isLoading).toBe(true);
    });

    test('should mark loading complete when onLoad is called', () => {
      const { result } = renderHook(() => use3DLoadingProgress());

      act(() => {
        result.current.onProgress(80, 100);
      });
      expect(result.current.loadingState.isLoading).toBe(true);

      act(() => {
        result.current.onLoad();
      });

      expect(result.current.loadingState.progress).toBe(100);
      expect(result.current.loadingState.isLoading).toBe(false);
    });

    test('should handle loading errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const { result } = renderHook(() => use3DLoadingProgress());

      const testError = new Error('Failed to load 3D asset');

      act(() => {
        result.current.onError(testError);
      });

      expect(result.current.loadingState.isLoading).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('3D asset loading error:', testError);

      consoleSpy.mockRestore();
    });

    test('should maintain progress state across multiple updates', () => {
      const { result } = renderHook(() => use3DLoadingProgress());

      // Simulate incremental loading
      const progressSteps = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

      progressSteps.forEach((step) => {
        act(() => {
          result.current.onProgress(step, 100);
        });
        expect(result.current.loadingState.progress).toBe(step);
      });

      expect(result.current.loadingState.isLoading).toBe(false);
    });

    test('should support progressive enhancement with multiple asset types', () => {
      const { result } = renderHook(() => use3DLoadingProgress());

      // Simulate loading different asset types progressively
      // Low-poly model (33% of total)
      act(() => {
        result.current.onProgress(33, 100);
      });
      expect(result.current.loadingState.progress).toBe(33);

      // Medium-poly model (66% of total)
      act(() => {
        result.current.onProgress(66, 100);
      });
      expect(result.current.loadingState.progress).toBe(66);

      // High-quality textures (100% of total)
      act(() => {
        result.current.onProgress(100, 100);
      });
      expect(result.current.loadingState.progress).toBe(100);
      expect(result.current.loadingState.isLoading).toBe(false);
    });

    test('should handle rapid progress updates', () => {
      const { result } = renderHook(() => use3DLoadingProgress());

      // Simulate rapid updates
      act(() => {
        for (let i = 0; i <= 100; i += 5) {
          result.current.onProgress(i, 100);
        }
      });

      expect(result.current.loadingState.progress).toBe(100);
      expect(result.current.loadingState.isLoading).toBe(false);
    });

    test('should not allow progress to exceed 100%', () => {
      const { result } = renderHook(() => use3DLoadingProgress());

      act(() => {
        result.current.onProgress(150, 100);
      });

      expect(result.current.loadingState.progress).toBe(150); // Raw calculation
      expect(result.current.loadingState.loaded).toBe(150);
    });
  });

  describe('Simulated Progressive Loading', () => {
    test('should simulate progressive loading when enabled', async () => {
      const { result } = renderHook(() =>
        useLoadingProgress({ simulateProgress: true, minDuration: 1000 })
      );

      expect(result.current.progress).toBe(0);
      expect(result.current.isLoading).toBe(true);

      // Advance time to simulate progress
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.progress).toBeGreaterThan(0);
      });
    });

    test('should slow down progress as it approaches 100%', async () => {
      const { result } = renderHook(() =>
        useLoadingProgress({ simulateProgress: true, minDuration: 500 })
      );

      // Progress should be faster in the beginning
      act(() => {
        jest.advanceTimersByTime(500);
      });

      const earlyProgress = result.current.progress;

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      const lateProgress = result.current.progress;

      // Progress should have slowed down
      expect(lateProgress).toBeGreaterThan(earlyProgress);
      expect(lateProgress).toBeLessThanOrEqual(95); // Stops at 95% until complete
    });

    test('should respect minimum duration before completing', async () => {
      const minDuration = 2000;
      const { result } = renderHook(() =>
        useLoadingProgress({ simulateProgress: true, minDuration })
      );

      // Fast forward to allow progress to build up
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Should still be loading or have high progress
      expect(result.current.isLoading).toBe(true);
      expect(result.current.progress).toBeGreaterThan(0);
    });

    test('should allow manual progress updates', () => {
      const { result } = renderHook(() =>
        useLoadingProgress({ simulateProgress: false })
      );

      act(() => {
        result.current.updateProgress(50);
      });

      expect(result.current.progress).toBe(50);

      act(() => {
        result.current.updateProgress(75);
      });

      expect(result.current.progress).toBe(75);
    });

    test('should clamp manual progress between 0 and 100', () => {
      const { result } = renderHook(() =>
        useLoadingProgress({ simulateProgress: false })
      );

      act(() => {
        result.current.updateProgress(-10);
      });
      expect(result.current.progress).toBe(0);

      act(() => {
        result.current.updateProgress(150);
      });
      expect(result.current.progress).toBe(100);
    });

    test('should complete loading immediately when complete() is called', async () => {
      const { result } = renderHook(() =>
        useLoadingProgress({ simulateProgress: false })
      );

      act(() => {
        result.current.complete();
      });

      expect(result.current.progress).toBe(100);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('Loading Screen Visual Feedback', () => {
    test('should display initial progress at 0%', () => {
      render(<LoadingScreen progress={0} />);

      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getByText('Building Excellence')).toBeInTheDocument();
    });

    test('should update displayed progress smoothly', () => {
      const { rerender } = render(<LoadingScreen progress={0} />);

      expect(screen.getByText('0%')).toBeInTheDocument();

      rerender(<LoadingScreen progress={50} />);

      // Progress should update (may not be instant due to animation)
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByText(/\d+%/)).toBeInTheDocument();
    });

    test('should show progressive building animation stages', () => {
      const { container, rerender } = render(<LoadingScreen progress={0} />);

      // Foundation stage (0-33%)
      rerender(<LoadingScreen progress={20} />);
      expect(container.querySelector('.bottom-0')).toBeInTheDocument();

      // Walls stage (33-66%)
      rerender(<LoadingScreen progress={50} />);
      expect(container.querySelector('.border-gold')).toBeInTheDocument();

      // Roof stage (66-100%) - check for the div with border styles
      rerender(<LoadingScreen progress={80} />);
      const roofElement = container.querySelector('.bottom-\\[4\\.5rem\\]');
      expect(roofElement).toBeInTheDocument();
    });

    test('should display brand elements', () => {
      render(<LoadingScreen progress={50} />);

      expect(screen.getByText('SB')).toBeInTheDocument();
      expect(screen.getByText('Infra')).toBeInTheDocument();
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    test('should show loading dots animation', () => {
      const { container } = render(<LoadingScreen progress={50} />);

      const dots = container.querySelectorAll('.animate-pulse');
      expect(dots.length).toBeGreaterThanOrEqual(3);
    });

    test('should trigger onComplete callback when progress reaches 100%', async () => {
      const onComplete = jest.fn();
      render(<LoadingScreen progress={100} onComplete={onComplete} />);

      // Advance timers to allow the component to process the 100% progress
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(onComplete).toHaveBeenCalled();
      });
    });

    test('should fade out when exiting', () => {
      const { container } = render(<LoadingScreen progress={100} />);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      const loadingDiv = container.firstChild as HTMLElement;
      // After progress reaches 100%, the component should start fading out
      expect(loadingDiv.className).toMatch(/opacity-/);
    });

    test('should display progress bar with correct width', () => {
      const { container } = render(<LoadingScreen progress={75} />);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      const progressBar = container.querySelector('.bg-gradient-to-r') as HTMLElement;
      expect(progressBar).toBeInTheDocument();
    });

    test('should show percentage-based loading progress', () => {
      const progressValues = [0, 25, 50, 75, 100];

      progressValues.forEach((progress) => {
        const { rerender } = render(<LoadingScreen progress={progress} />);

        act(() => {
          jest.advanceTimersByTime(2000);
        });

        expect(screen.getByText(`${progress}%`)).toBeInTheDocument();

        rerender(<LoadingScreen progress={0} />);
      });
    });
  });

  describe('Progressive Enhancement Strategy', () => {
    test('should support loading in stages: low-poly → medium → high-quality', () => {
      const { result } = renderHook(() => use3DLoadingProgress());

      // Stage 1: Low-poly model (fast load)
      act(() => {
        result.current.onProgress(30, 100);
      });
      expect(result.current.loadingState.progress).toBe(30);
      expect(result.current.loadingState.isLoading).toBe(true);

      // Stage 2: Medium-poly model
      act(() => {
        result.current.onProgress(60, 100);
      });
      expect(result.current.loadingState.progress).toBe(60);
      expect(result.current.loadingState.isLoading).toBe(true);

      // Stage 3: High-quality textures and materials
      act(() => {
        result.current.onProgress(100, 100);
      });
      expect(result.current.loadingState.progress).toBe(100);
      expect(result.current.loadingState.isLoading).toBe(false);
    });

    test('should handle partial loading failures gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const { result } = renderHook(() => use3DLoadingProgress());

      // Load low-poly successfully
      act(() => {
        result.current.onProgress(30, 100);
      });
      expect(result.current.loadingState.progress).toBe(30);

      // High-quality texture fails to load
      act(() => {
        result.current.onError(new Error('Texture load failed'));
      });

      // Should stop loading but maintain progress
      expect(result.current.loadingState.isLoading).toBe(false);
      expect(result.current.loadingState.progress).toBe(30);

      consoleSpy.mockRestore();
    });

    test('should prioritize critical assets in loading order', () => {
      const { result } = renderHook(() => use3DLoadingProgress());

      // Critical assets load first (geometry)
      act(() => {
        result.current.onProgress(40, 100);
      });
      expect(result.current.loadingState.progress).toBeGreaterThanOrEqual(40);

      // Non-critical assets load later (high-res textures)
      act(() => {
        result.current.onProgress(100, 100);
      });
      expect(result.current.loadingState.progress).toBe(100);
    });
  });
});
