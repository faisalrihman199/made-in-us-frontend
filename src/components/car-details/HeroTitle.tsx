import { Button } from "@/components/ui/button";
import { Star, Share2, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWatchlistStatus, toggleWatchlist } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useState } from "react";

interface HeroTitleProps {
  id: string;
  title: string;
  subtitle: string;
  hasNoReserve?: boolean;
}

const HeroTitle = ({ id, title, subtitle, hasNoReserve = false }: HeroTitleProps) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isSharing, setIsSharing] = useState(false);

  const { data: watchlistData } = useQuery({
    queryKey: ["watchlist-status", id],
    queryFn: () => getWatchlistStatus(id),
    enabled: isAuthenticated
  });

  const watchlistMutation = useMutation({
    mutationFn: () => toggleWatchlist(id),
    onSuccess: (data) => {
      queryClient.setQueryData(["watchlist-status", id], data);
      toast.success(data.watched ? "Added to watchlist" : "Removed from watchlist");
    },
    onError: () => {
      toast.error("Failed to update watchlist");
    }
  });

  const handleWatchClick = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to use watchlist");
      return;
    }
    watchlistMutation.mutate();
  };

  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: subtitle,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsSharing(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setIsSharing(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const isWatched = watchlistData?.watched;

  return (
    <div className="bg-background">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <Button 
              variant={isWatched ? "default" : "outline"} 
              size="sm" 
              className={`gap-2 transition-all duration-300 ${isWatched ? 'bg-[#2f884d] hover:bg-[#25733f]' : ''}`}
              onClick={handleWatchClick}
              disabled={watchlistMutation.isPending}
            >
              <Star className={`w-4 h-4 ${isWatched ? 'fill-white' : ''}`} />
              {isWatched ? "Watching" : "Watch"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleShareClick}
            >
              {isSharing ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
              {isSharing ? "Copied" : "Share"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroTitle;