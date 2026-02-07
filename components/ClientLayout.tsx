'use client';

import { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';
import { useLoadingProgress } from '@/hooks/useLoadingProgress';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { progress, isLoading, complete } = useLoadingProgress({
    minDuration: 2000,
    simulateProgress: true,
  });
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if this is a returning visitor
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (hasVisited) {
      // Skip loading screen for returning visitors in the same session
      complete();
      setShowContent(true);
    } else {
      // Mark as visited
      sessionStorage.setItem('hasVisited', 'true');
      setShowContent(true);
    }
  }, [complete]);

  useEffect(() => {
    if (!isLoading) {
      // Small delay before showing content for smooth transition
      const timeout = setTimeout(() => {
        setShowContent(true);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && <LoadingScreen progress={progress} />}
      <div
        className={`transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {showContent && children}
      </div>
    </>
  );
}
