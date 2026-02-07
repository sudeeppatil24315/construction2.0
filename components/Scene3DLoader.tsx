'use client';

interface Scene3DLoaderProps {
  progress: number;
}

export default function Scene3DLoader({ progress }: Scene3DLoaderProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
      <div className="text-center">
        {/* Loading spinner */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
          <div
            className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin"
            style={{
              animationDuration: '1s',
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gold text-lg font-bold">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Loading text */}
        <p className="text-gray-400 text-sm">Loading 3D Scene...</p>
        
        {/* Progress bar */}
        <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mt-4 mx-auto">
          <div
            className="h-full bg-gradient-to-r from-gold via-gold-light to-gold transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
