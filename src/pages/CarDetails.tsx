import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroGallery from '@/components/car-details/HeroGallery';
import HeroTitle from '@/components/car-details/HeroTitle';
import AuctionDetails from '@/components/car-details/AuctionDetails';
import AuctionSidebar from '@/components/car-details/AuctionSidebar';
import { useQuery } from "@tanstack/react-query";
import { fetchCarById, type CarDetailsResponse } from "@/lib/api";

type GalleryImage = { url: string; alt: string };

function buildGallery(car: CarDetailsResponse) {
  const images = (car.images ?? []).filter(Boolean);
  const all: GalleryImage[] = images.map((url, idx) => ({
    url,
    alt: `Exterior - Photo ${idx + 1}`
  }));

  const mainImage = all[0] ?? { url: car.firstImage, alt: "Exterior - Main" };
  return {
    mainImage,
    exteriorImages: all.slice(1),
    interiorImages: [] as GalleryImage[],
    mechanicalImages: [] as GalleryImage[],
    docsImages: [] as GalleryImage[],
    otherImages: [] as GalleryImage[]
  };
}

const CarDetails = () => {
  const { id } = useParams();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const carQuery = useQuery({
    queryKey: ["car", id],
    enabled: Boolean(id),
    queryFn: () => fetchCarById(id as string)
  });

  const gallery = useMemo(() => {
    if (!carQuery.data) return null;
    return buildGallery(carQuery.data);
  }, [carQuery.data]);

  if (carQuery.isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-600">
            Loading car details...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (carQuery.isError || !carQuery.data || !gallery) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-600">
            Car not found.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const car = carQuery.data;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <HeroTitle 
          id={car.id}
          title={car.title}
          subtitle={car.subtitle || `${car.year ?? ""} ${car.make ?? ""} ${car.model ?? ""}`.trim()}
        />

        <HeroGallery
          mainImage={gallery.mainImage}
          exteriorImages={gallery.exteriorImages}
          interiorImages={gallery.interiorImages}
          mechanicalImages={gallery.mechanicalImages}
          docsImages={gallery.docsImages}
          otherImages={gallery.otherImages}
        />

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-[9fr,3fr] lg:grid-cols-[1fr,380px] gap-8">
            <AuctionDetails car={car} />
            <div 
              ref={sidebarRef}
              className="lg:sticky lg:top-24 lg:h-fit max-h-[calc(100vh-120px)] overflow-y-auto overflow-x-hidden rounded-[20px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <AuctionSidebar car={car} />
            </div>
          </div>
        </div>
        
      </main>
      <Footer />
    </div>
  );
};

export default CarDetails;
