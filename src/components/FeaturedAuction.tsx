import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Vehicle {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  images: string[];
}

const featuredVehicles: Vehicle[] = [
  {
    id: 1,
    title: "2024 Porsche 911 Carrera GTS Coupe",
    subtitle: "473-hp Twin-Turbo 3.0L Flat-6, 8-Speed PDK",
    price: 150000,
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=200&q=80"
    ]
  },
  {
    id: 2,
    title: "2023 Porsche 911 GT3 RS",
    subtitle: "4.0L Flat-Six, PDK, Weissach Package",
    price: 225000,
    images: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&h=400&q=80",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=400&h=300&q=80",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=300&h=200&q=80"
    ]
  },
  {
    id: 3,
    title: "2022 Ferrari F8 Tributo",
    subtitle: "Twin-Turbo V8, Carbon Fiber Everything",
    price: 275000,
    images: [
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1200&h=800&q=80",
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=600&h=400&q=80",
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=400&h=300&q=80",
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=300&h=200&q=80"
    ]
  }
];

const FeaturedVehicle = () => {
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentVehicle = featuredVehicles[currentVehicleIndex];
  const { images } = currentVehicle;

  const nextVehicle = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      const nextIndex = (currentVehicleIndex + 1) % featuredVehicles.length;
      setCurrentVehicleIndex(nextIndex);
      setCurrentImageIndex(0);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevVehicle = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      const prevIndex = currentVehicleIndex === 0 ? featuredVehicles.length - 1 : currentVehicleIndex - 1;
      setCurrentVehicleIndex(prevIndex);
      setCurrentImageIndex(0);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const nextImage = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevImage = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex((prev) => 
        prev === 0 ? images.length - 1 : prev - 1
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToImage = (index: number) => {
    if (!isTransitioning && index !== currentImageIndex) {
      setIsTransitioning(true);
      setCurrentImageIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      nextVehicle();
    }, 8000);
    return () => clearInterval(timer);
  }, [currentVehicleIndex]);

  return (
    <div className="relative bg-background">
      <div className="max-w-screen-2xl mx-auto h-[600px]">
        {/* Featured Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 p-4 h-full">
          {/* Main Featured Image */}
          <div className="md:col-span-3 relative h-full bg-muted overflow-hidden rounded-lg">
            <img
              src={images[currentImageIndex]}
              alt={currentVehicle.title}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                isTransitioning ? "opacity-50" : "opacity-100"
              }`}
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            {/* Top Badge */}
            <div>
              <Badge className="bg-white/90 text-black text-xs font-semibold px-2 py-1 rounded">
                FEATURED
              </Badge>
            </div>
            
            {/* Bottom Content */}
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-1">{currentVehicle.title}</h2>
              <p className="text-lg mb-3 text-white/90">{currentVehicle.subtitle}</p>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="font-medium">
                    Price: ${currentVehicle.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          

          {/* Dots Navigation */}
          <div className="absolute bottom-4 right-4 flex gap-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentImageIndex 
                  ? "bg-white scale-100" 
                  : "bg-white/40 hover:bg-white/60"}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2">
          {images.slice(0, 4).map((image, index) => (
            <div 
              key={index}
              onClick={() => goToImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                index === currentImageIndex ? "ring-2 ring-primary" : ""
              }`}
            >
              <img
                src={image}
                alt={`${currentVehicle.title} view ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>

          {/* Thumbnail Navigation */}
          <div className="absolute bottom-6 right-6 hidden md:flex space-x-2">
            {featuredVehicles.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentVehicleIndex(index);
                  setCurrentImageIndex(0);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentVehicleIndex ? "bg-gray-900 scale-125" : "bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Vehicle Navigation */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0">
            <div className="container mx-auto px-4 flex justify-between">
              <button 
                onClick={prevVehicle}
                className="opacity-0 bg-gray-600 opacity-50 hover:opacity-100 rounded-full p-1 px-2 mx-2"
              >
                <ChevronLeft className="h-8 w-6 text-white" />
              </button>
              <button 
                onClick={nextVehicle}
                className="opacity-0 bg-gray-600 opacity-50 hover:opacity-100 rounded-full p-1 px-2 mx-2"
              >
                <ChevronRight className="h-8 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedVehicle;