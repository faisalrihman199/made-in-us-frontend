import { useEffect, useMemo, useState, useRef } from "react";
import Header from "@/components/Header";
import VehicleSearch from "@/components/VehicleSearch";
import VehicleCard from "@/components/AuctionCard";
import PromoBanner from "@/components/PromoBanner";
import Footer from "@/components/Footer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCars, type CarListItem } from "@/lib/api";

const Index = () => {
  const [filters, setFilters] = useState({
    minYear: null as number | null,
    maxYear: null as number | null,
    brand: null as string | null,
    model: null as string | null,
    bodyType: null as string | null,
    color: null as string | null,
    engine: null as string | null,
    minMileage: null as number | null,
    maxMileage: null as number | null,
    maxPrice: null as number | null,
    transmission: null as string | null,
    search: "" as string,
    sortBy: "Featured",
    seed: useMemo(() => Math.random().toString(36).substring(7), [])
  });
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const queryKey = useMemo(() => ["cars", filters], [filters]);
  const carsQuery = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchCars({
        page: pageParam as number,
        pageSize: 20,
        ...filters,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((acc, p) => acc + p.items.length, 0);
      return loaded < lastPage.total ? lastPage.page + 1 : undefined;
    },
  });

  const visibleVehicles: CarListItem[] = useMemo(
    () => (carsQuery.data?.pages ?? []).flatMap((p) => p.items),
    [carsQuery.data]
  );

  // Fetch a larger set of vehicles once to populate filter dropdowns with a wide variety of options
  const filterDataQuery = useInfiniteQuery({
    queryKey: ["cars-for-filters"],
    queryFn: ({ pageParam }) =>
      fetchCars({
        page: pageParam as number,
        pageSize: 100,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.items.length > 0 ? lastPage.page + 1 : undefined),
    staleTime: Infinity,
  });

  const allVehiclesForFilters = useMemo(
    () => (filterDataQuery.data?.pages ?? []).flatMap((p) => p.items),
    [filterDataQuery.data]
  );

  // Pass the unfiltered/broad set into VehicleSearch so it can build dropdown options.
  const allVehicles = allVehiclesForFilters.length > 0 ? allVehiclesForFilters : visibleVehicles;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (carsQuery.isFetchingNextPage || !carsQuery.hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          void carsQuery.fetchNextPage();
        }
      },
      { 
        threshold: 0.1,
        // Trigger when the sentinel is within 600px of the viewport (approx 1-2 rows)
        rootMargin: '0px 0px 600px 0px' 
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;
    return () => observer.disconnect();
  }, [carsQuery.hasNextPage, carsQuery.isFetchingNextPage, carsQuery.fetchNextPage]);


  const VehicleSkeleton = () => (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 animate-pulse h-full">
      <div className="aspect-[16/10] bg-gray-100" />
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-gray-100 rounded-lg w-3/4" />
          <div className="h-4 bg-gray-100 rounded-md w-1/2" />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="h-8 bg-gray-50 rounded-xl w-full" />
          <div className="h-8 bg-gray-50 rounded-xl w-full" />
        </div>
        <div className="flex justify-between items-center pt-6 border-t border-gray-50">
          <div className="h-8 bg-gray-100 rounded-lg w-1/3" />
          <div className="h-10 bg-gray-200 rounded-xl w-1/4" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <VehicleSearch filters={filters} onFilterChange={handleFilterChange} allVehicles={allVehicles} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {carsQuery.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <VehicleSkeleton key={i} />
            ))}
          </div>
        ) : visibleVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleVehicles.map((vehicle, index) => (
              <VehicleCard key={index} {...vehicle} />
            ))}
            {/* Sentinel for infinite scroll */}
            <div ref={loadMoreRef} className="h-4 w-full" />
          </div>

        ) : (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700 mb-2">No vehicles found</p>
              <p className="text-gray-500">Try adjusting your search or filters to see more results</p>
            </div>
          </div>
        )}

        {/* Loading spinner for pagination */}
        {carsQuery.isFetchingNextPage && (
          <div className="flex justify-center items-center py-12 gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-[3px] border-gray-200 border-t-gray-900"></div>
            <span className="text-sm text-gray-600 font-medium">Loading more vehicles...</span>
          </div>
        )}
      </div>
      <div className="md:mx-8">
        <hr />
      </div>
      <PromoBanner />
      <Footer />
    </div>
  );
};

export default Index;
