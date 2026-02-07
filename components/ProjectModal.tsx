'use client';

import { useState, useEffect, useRef } from 'react';
import { Project } from '@/types';
import { PinchDetector, SwipeDetector, isTouchDevice } from '@/lib/touch-gestures';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [zoomScale, setZoomScale] = useState(1);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const pinchDetectorRef = useRef<PinchDetector | null>(null);
  const swipeDetectorRef = useRef<SwipeDetector | null>(null);
  const isTouch = isTouchDevice();

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Initialize gesture detectors for touch devices
    if (isTouch) {
      pinchDetectorRef.current = new PinchDetector();
      swipeDetectorRef.current = new SwipeDetector();
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, isTouch]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
    setIsZoomed(false);
    setZoomScale(1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
    setIsZoomed(false);
    setZoomScale(1);
  };

  const handleImageClick = () => {
    if (!isTouch) {
      setIsZoomed(!isZoomed);
      if (isZoomed) {
        setZoomScale(1);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || isTouch) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  // Touch event handlers for pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!pinchDetectorRef.current || !swipeDetectorRef.current) return;
    
    pinchDetectorRef.current.onTouchStart(e.nativeEvent);
    swipeDetectorRef.current.onTouchStart(e.nativeEvent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pinchDetectorRef.current) return;
    
    pinchDetectorRef.current.onTouchMove(e.nativeEvent, (pinch) => {
      setZoomScale(Math.max(1, Math.min(3, pinch.scale)));
      setIsZoomed(pinch.scale > 1);
      
      // Calculate zoom position based on pinch center
      if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = ((pinch.center.x - rect.left) / rect.width) * 100;
        const y = ((pinch.center.y - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
      }
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!pinchDetectorRef.current || !swipeDetectorRef.current) return;
    
    pinchDetectorRef.current.onTouchEnd();
    
    // Handle swipe for image navigation
    swipeDetectorRef.current.onTouchEnd(e.nativeEvent, (swipe) => {
      if (swipe.direction === 'left') {
        handleNextImage();
      } else if (swipe.direction === 'right') {
        handlePrevImage();
      }
    });
    
    // Update pinch detector's scale
    if (pinchDetectorRef.current) {
      pinchDetectorRef.current.setScale(zoomScale);
    }
  };

  const currentImage = project.images[currentImageIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          style={{
            minWidth: '44px',
            minHeight: '44px',
            width: '44px',
            height: '44px',
          }}
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery Section */}
          <div className="relative bg-black">
            {/* Main Image */}
            <div
              ref={imageContainerRef}
              className="relative aspect-[4/3] overflow-hidden cursor-zoom-in"
              onClick={handleImageClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => {
                if (!isTouch) {
                  setIsZoomed(false);
                }
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                touchAction: 'none', // Prevent default touch behaviors
              }}
            >
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="w-full h-full object-cover transition-transform duration-300"
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transform: `scale(${isTouch ? zoomScale : 2})`,
                      }
                    : {}
                }
              />
              
              {/* Zoom Indicator */}
              {!isZoomed && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {isTouch ? 'Pinch to zoom' : 'Click to zoom'}
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            {project.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center bg-black/50 hover:bg-gold text-white rounded-full transition-colors"
                  style={{
                    minWidth: '44px',
                    minHeight: '44px',
                    width: '44px',
                    height: '44px',
                  }}
                  aria-label="Previous image"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center bg-black/50 hover:bg-gold text-white rounded-full transition-colors"
                  style={{
                    minWidth: '44px',
                    minHeight: '44px',
                    width: '44px',
                    height: '44px',
                  }}
                  aria-label="Next image"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {project.images.length}
            </div>

            {/* Thumbnail Strip */}
            {project.images.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                <div className="flex gap-2 overflow-x-auto">
                  {project.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setIsZoomed(false);
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-gold scale-110'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Project Details Section */}
          <div className="p-8 overflow-y-auto max-h-[80vh]">
            {/* Category Badge */}
            <span className="inline-block px-3 py-1 bg-gold text-black text-xs font-semibold rounded-full mb-4">
              {project.category.toUpperCase()}
            </span>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-4">{project.title}</h2>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>

            {/* Image Caption */}
            {currentImage.caption && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-gold">
                <p className="text-sm text-gray-700 italic">{currentImage.caption}</p>
              </div>
            )}

            {/* Project Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Location</h3>
                <p className="text-gray-900">{project.location}</p>
              </div>
              {project.area && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Area</h3>
                  <p className="text-gray-900">{project.area}</p>
                </div>
              )}
              {project.duration && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Duration</h3>
                  <p className="text-gray-900">{project.duration}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Completed</h3>
                <p className="text-gray-900">
                  {new Date(project.completionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>
              {project.client && (
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Client</h3>
                  <p className="text-gray-900">{project.client}</p>
                </div>
              )}
            </div>

            {/* Tags */}
            {project.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 3D Model Link */}
            {project.has3DModel && project.modelUrl && (
              <div className="mt-6 p-4 bg-gold/10 rounded-lg border border-gold">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🏗️</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">3D Model Available</h3>
                    <p className="text-sm text-gray-600">
                      View this project in interactive 3D
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-gold/80 transition-colors">
                    View 3D
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
