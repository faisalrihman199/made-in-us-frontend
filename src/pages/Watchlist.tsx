import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import VehicleCard from "@/components/AuctionCard";
import Footer from "@/components/Footer";
import { fetchMyWatchlist } from "@/lib/api";
import { Star, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Watchlist = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: watchlist, isLoading, isError } = useQuery({
    queryKey: ["watchlist"],
    queryFn: fetchMyWatchlist,
    enabled: isAuthenticated
  });

  const vehicles = watchlist?.items ?? [];

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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#2f884d]/10 flex items-center justify-center">
            <Star className="w-6 h-6 text-[#2f884d] fill-[#2f884d]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Watchlist</h1>
            <p className="text-gray-500">Vehicles you're keeping an eye on</p>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <Lock className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-xl font-semibold text-gray-700 mb-2">Sign in to view your watchlist</p>
            <p className="text-gray-500 mb-6">Track your favorite vehicles and get updates.</p>
            <Button onClick={() => navigate("/")} className="bg-[#2f884d] hover:bg-[#25733f] rounded-xl px-8">
              Return to Home
            </Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <VehicleSkeleton key={i} />
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle, index) => (
              <VehicleCard key={index} {...vehicle} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <Star className="w-16 h-16 text-gray-200 mb-4" />
            <p className="text-xl font-semibold text-gray-700 mb-2">Your watchlist is empty</p>
            <p className="text-gray-500">Star some vehicles to see them here!</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Watchlist;
