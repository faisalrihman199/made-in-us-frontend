import React, { useLayoutEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X, Search, ArrowLeft, ArrowRight, Maximize2, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface GalleryModalProps {
  open: boolean;
  onClose: () => void;
  images: { url: string; alt: string; }[];
  initialIndex?: number;
  categories: string[];
  activeCategory?: string;
  onCategoryChange: (category: string) => void;
}

const GalleryModal = ({
  open,
  onClose,
  images,
  initialIndex = 0,
  categories,
  activeCategory = "All Photos",
  onCategoryChange,
}: GalleryModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
  const [startScale, setStartScale] = useState(1);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const lastTapRef = useRef<number>(0);
  const fallbackSrc = "/coming-soon.png";

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3)); // Max zoom 3x
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 1)); // Min zoom 1x
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Always prevent default to stop page zoom
    e.preventDefault();
    
    // Calculate zoom based on wheel delta
    const delta = -e.deltaY * 0.01;
    const newScale = Math.max(1, Math.min(3, scale + delta));
    
    if (newScale !== scale) {
      // Calculate cursor position relative to image
      const rect = imageRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Calculate new position to zoom towards cursor
      const scaleChange = newScale - scale;
      const newX = position.x - (mouseX * scaleChange);
      const newY = position.y - (mouseY * scaleChange);
      
      // Update scale and position
      setScale(newScale);
      setPosition({
        x: Math.max(-rect.width * (newScale - 1), Math.min(0, newX)),
        y: Math.max(-rect.height * (newScale - 1), Math.min(0, newY))
      });
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (scale > 1) {
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
    }
  };

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      
      // Calculate bounds based on image size and zoom
      const bounds = {
        x: ((imageRef.current?.width || 0) * (scale - 1)) / 2,
        y: ((imageRef.current?.height || 0) * (scale - 1)) / 2
      };
      
      setPosition({
        x: Math.max(-bounds.x, Math.min(bounds.x, newX)),
        y: Math.max(-bounds.y, Math.min(bounds.y, newY))
      });
    }
  }, [isDragging, scale]);

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Reset zoom and position when changing images
  React.useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex, activeCategory]);

  // Setup drag event listeners
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, handleDragMove]);

  // Filter images based on active category
  const filteredImages = useMemo(
    () =>
      activeCategory === "All Photos"
        ? images
        : images.filter((img) =>
            img.alt.startsWith(activeCategory === "Docs" ? "Documentation" : activeCategory)
          ),
    [activeCategory, images]
  );

  // Keep loader visible until we have an actual rendered image.
  // Use layout effect to avoid flashing the previous image while the next downloads.
  useLayoutEffect(() => {
    const next = filteredImages[currentIndex]?.url;
    if (!next) return;
    // Important: don't re-trigger loading if src didn't change.
    // filteredImages can change identity often; if we always set loading=true,
    // the <img> won't fire onLoad again (src unchanged) -> infinite spinner.
    if (next !== imageSrc) {
      setIsImageLoading(true);
      setImageSrc(next);
    }
  }, [currentIndex, filteredImages, imageSrc]);

  // Reset current index when category changes to avoid out of bounds
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // Auto-focus overlay so arrow keys work immediately.
  React.useEffect(() => {
    overlayRef.current?.focus();
  }, [open]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onClose();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black z-50"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent z-10">
          <div className="px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between text-white gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-sm text-center">
                {currentIndex + 1} of {filteredImages.length}
              </span>
              <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2 sm:pb-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={cn(
                      "text-sm hover:text-white transition-colors",
                      activeCategory === category ? "text-white" : "text-gray-400"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Zoom Controls */}
              {scale > 1 && (
                <span className="text-sm text-gray-400">
                  {Math.round(scale * 100)}%
                </span>
              )}
              <button 
                onClick={handleZoomOut}
                className={cn(
                  "p-2 hover:bg-white/10 rounded-lg transition-colors",
                  scale <= 1 && "opacity-50 cursor-not-allowed"
                )}
                disabled={scale <= 1}
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button 
                onClick={handleZoomIn}
                className={cn(
                  "p-2 hover:bg-white/10 rounded-lg transition-colors",
                  scale >= 3 && "opacity-50 cursor-not-allowed"
                )}
                disabled={scale >= 3}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button 
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          onWheel={handleWheel}
          onTouchStart={(e) => {
            if (e.touches.length === 2) {
              const distance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
              );
              setTouchStartDistance(distance);
              setStartScale(scale);
            } else if (e.touches.length === 1) {
              const now = Date.now();
              if (now - lastTapRef.current < 300) {
                // Double tap
                if (scale > 1) {
                  setScale(1);
                  setPosition({ x: 0, y: 0 });
                } else {
                  setScale(2);
                }
                e.preventDefault();
              }
              lastTapRef.current = now;
            }
          }}
          onTouchMove={(e) => {
            if (e.touches.length === 2 && touchStartDistance !== null) {
              e.preventDefault();
              const distance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
              );
              const newScale = Math.min(Math.max(startScale * (distance / touchStartDistance), 1), 3);
              setScale(newScale);
            }
          }}
          onTouchEnd={() => {
            setTouchStartDistance(null);
          }}
          style={{ touchAction: scale > 1 ? 'none' : 'pan-x pan-y pinch-zoom' }}
        >
          {filteredImages.length > 0 ? (
            <div 
              className={cn(
                "relative cursor-grab transition-none",
                isDragging && "cursor-grabbing"
              )}
              onMouseDown={handleDragStart}
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            >
              {isImageLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                </div>
              ) : null}
              <img
                ref={imageRef}
                src={imageSrc}
                alt={filteredImages[currentIndex].alt}
                className="max-h-[85vh] max-w-[85vw] object-contain transition-transform duration-200"
                style={{
                  opacity: isImageLoading ? 0 : 1,
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center'
                }}
                draggable="false"
                onLoad={() => setIsImageLoading(false)}
                onError={() => {
                  if (imageSrc !== fallbackSrc) {
                    setIsImageLoading(true);
                    setImageSrc(fallbackSrc);
                  } else {
                    setIsImageLoading(false);
                  }
                }}
              />
            </div>
          ) : (
            <div className="text-white text-lg">No images in this category</div>
          )}
        </div>

        {/* Navigation Buttons */}
        {filteredImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default GalleryModal;