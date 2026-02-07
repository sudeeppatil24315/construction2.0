'use client';

import { useState, useCallback } from 'react';

interface Asset3DLoadingState {
  loaded: number;
  total: number;
  progress: number;
  isLoading: boolean;
}

export function use3DLoadingProgress() {
  const [loadingState, setLoadingState] = useState<Asset3DLoadingState>({
    loaded: 0,
    total: 0,
    progress: 0,
    isLoading: true,
  });

  const onProgress = useCallback((loaded: number, total: number) => {
    const progress = total > 0 ? (loaded / total) * 100 : 0;
    setLoadingState({
      loaded,
      total,
      progress,
      isLoading: progress < 100,
    });
  }, []);

  const onLoad = useCallback(() => {
    setLoadingState((prev) => ({
      ...prev,
      progress: 100,
      isLoading: false,
    }));
  }, []);

  const onError = useCallback((error: Error) => {
    console.error('3D asset loading error:', error);
    setLoadingState((prev) => ({
      ...prev,
      isLoading: false,
    }));
  }, []);

  return {
    loadingState,
    onProgress,
    onLoad,
    onError,
  };
}
