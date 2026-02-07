'use client';

import { useState, useEffect } from 'react';

interface UseLoadingProgressOptions {
  minDuration?: number; // Minimum loading duration in ms
  simulateProgress?: boolean; // Simulate progress if no real progress tracking
}

export function useLoadingProgress(options: UseLoadingProgressOptions = {}) {
  const { minDuration = 2000, simulateProgress = true } = options;
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!simulateProgress) return;

    // Simulate progressive loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Slow down as we approach 100%
        const increment = prev < 50 ? 5 : prev < 80 ? 2 : 1;
        return Math.min(prev + increment, 95); // Stop at 95% until complete
      });
    }, 100);

    return () => clearInterval(interval);
  }, [simulateProgress]);

  useEffect(() => {
    // Check if minimum duration has passed and we're at 95%+
    if (progress >= 95) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);

      const timeout = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }, remaining);

      return () => clearTimeout(timeout);
    }
  }, [progress, minDuration, startTime]);

  const updateProgress = (value: number) => {
    setProgress(Math.min(Math.max(value, 0), 100));
  };

  const complete = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return {
    progress,
    isLoading,
    updateProgress,
    complete,
  };
}
