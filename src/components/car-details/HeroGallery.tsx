import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import GalleryModal from "./GalleryModal";

interface GalleryImage {
  url: string;
  alt: string;
}

interface HeroGalleryProps {
  mainImage: GalleryImage;
  exteriorImages: GalleryImage[];
  interiorImages: GalleryImage[];
  mechanicalImages: GalleryImage[];
  docsImages: GalleryImage[];
  otherImages: GalleryImage[];
}

function ImageWithSkeleton({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const fallbackSrc = "/coming-soon.png";

  useEffect(() => {
    setLoaded(false);
    setCurrentSrc(src);
  }, [src]);

  return (
    <>
      {!loaded ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" aria-hidden="true" />
      ) : null}
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (currentSrc !== fallbackSrc) {
            setLoaded(false);
            setCurrentSrc(fallbackSrc);
          } else {
            // fallback also failed; stop loading animation to avoid infinite spinner
            setLoaded(true);
          }
        }}
        loading="lazy"
      />
    </>
  );
}

const HeroGallery = ({
  mainImage,
  exteriorImages,
  interiorImages,
  mechanicalImages,
  docsImages,
  otherImages,
}: HeroGalleryProps) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Photos");
  const [initialIndex, setInitialIndex] = useState(0);

  const allImages = [
    mainImage,
    ...exteriorImages,
    ...interiorImages,
    ...mechanicalImages,
    ...docsImages,
    ...otherImages
  ];
  const totalPhotos = allImages.length;

  const preview1 = allImages[1] ?? mainImage;
  const preview2 = allImages[2] ?? allImages[1] ?? mainImage;

  const handleOpenGallery = (category: string, index: number = 0) => {
    // No real categories yet; always open "All Photos" at a given index.
    setActiveCategory("All Photos");
    setInitialIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 h-[80vh]">
          {/* Main Image - Takes 9 columns */}
          <div className="col-span-9 h-full">
            <div 
              className="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer h-full"
              onClick={() => handleOpenGallery("All Photos", 0)}
            >
              <ImageWithSkeleton
                src={mainImage.url}
                alt={mainImage.alt}
                className="absolute inset-0 w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
            </div>
          </div>

          {/* Sidebar Images - Takes 3 columns */}
          <div className="col-span-3 grid grid-rows-3 gap-4 h-full">
            <div
              className="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
              onClick={() => handleOpenGallery("All Photos", 1)}
            >
              <ImageWithSkeleton
                src={preview1.url}
                alt="Preview 1"
                className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            </div>

            <div
              className="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
              onClick={() => handleOpenGallery("All Photos", 2)}
            >
              <ImageWithSkeleton
                src={preview2.url}
                alt="Preview 2"
                className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            </div>

            <div
              className="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
              onClick={() => handleOpenGallery("All Photos", 0)}
            >
              <ImageWithSkeleton
                src={preview2.url || preview1.url || mainImage.url}
                alt="All Photos"
                className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-white text-center">
                  <span className="block text-2xl font-bold">All Photos</span>
                  <span className="font-medium text-lg">({totalPhotos})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          {/* Main Image */}
          <div 
            className="relative aspect-[4/3] mb-4 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => handleOpenGallery("All Photos", 0)}
          >
            <ImageWithSkeleton
              src={mainImage.url}
              alt={mainImage.alt}
              className="absolute inset-0 w-full h-full object-cover hover:opacity-90 transition-opacity"
            />
          </div>

          {/* Horizontal Scrollable Preview */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory touch-pan-x scrollbar-hide">
            <div
              className="relative flex-none w-60 aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-pointer group snap-start"
              onClick={() => handleOpenGallery("All Photos", 1)}
            >
              <ImageWithSkeleton
                src={preview1.url}
                alt="Preview 1"
                className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            </div>

            <div
              className="relative flex-none w-60 aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-pointer group snap-start"
              onClick={() => handleOpenGallery("All Photos", 2)}
            >
              <ImageWithSkeleton
                src={preview2.url}
                alt="Preview 2"
                className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            </div>

            {/* All Photos Button/Image */}
            <div 
              className="relative flex-none w-60 aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-pointer group snap-start"
              onClick={() => handleOpenGallery("All Photos", 0)}
            >
              <ImageWithSkeleton
                src={preview2.url || preview1.url || mainImage.url}
                alt="All Photos"
                className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-white text-center">
                  <span className="block text-2xl font-bold">All Photos</span>
                  <span className="font-medium text-lg">({totalPhotos})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GalleryModal 
        open={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={allImages}
        initialIndex={initialIndex}
        categories={["All Photos"]}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
    </>
  );
};

export default HeroGallery;