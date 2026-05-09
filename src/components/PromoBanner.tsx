import { Button } from "@/components/ui/button";
import { Star, Truck, BarChart2, Smile, Users, Heart, ChevronLeft, ChevronRight, BadgeCheck, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const PromoBanner = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for right (next), -1 for left (prev)
  const [isPaused, setIsPaused] = useState(false);

  const { data: result, isLoading } = useQuery({
    queryKey: ["public-reviews"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/reviews?isApproved=true&limit=5`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    }
  });

  const reviews = result?.reviews || [];

  useEffect(() => {
    if (!reviews.length || isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length, isPaused]);

  const nextReview = () => {
    if (reviews.length) {
      setDirection(1);
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    }
  };

  const prevReview = () => {
    if (reviews.length) {
      setDirection(-1);
      setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }
  };

  // Mock avatars for the bottom section
  const mockAvatars = [
    "https://i.pravatar.cc/150?u=1",
    "https://i.pravatar.cc/150?u=2",
    "https://i.pravatar.cc/150?u=3",
    "https://i.pravatar.cc/150?u=4",
    "https://i.pravatar.cc/150?u=5"
  ];

  return (
    <div className="bg-[#F9FAFB] px-4 sm:px-6 lg:px-8 py-16 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* CARD 1: Why Made in US? */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100">
          <h2 className="text-[28px] sm:text-[32px] font-bold tracking-tight mb-8">Why Made in US?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8">
            {/* Stat 1 */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                <Truck className="w-8 h-8 text-[#2E7D32]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[26px] font-black tracking-tight leading-none inline-block border-b-4 border-[#4CAF50] pb-1 w-max">30K+</span>
                <span className="text-[14px] text-gray-500 font-medium mt-2">Vehicles delivered</span>
              </div>
            </div>
            {/* Stat 2 */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                <BarChart2 className="w-8 h-8 text-[#2E7D32]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[26px] font-black tracking-tight leading-none inline-block border-b-4 border-[#4CAF50] pb-1 w-max">$670M+</span>
                <span className="text-[14px] text-gray-500 font-medium mt-2">Transaction volume</span>
              </div>
            </div>
            {/* Stat 3 */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                <Smile className="w-8 h-8 text-[#2E7D32]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[26px] font-black tracking-tight leading-none inline-block border-b-4 border-[#4CAF50] pb-1 w-max">99%+</span>
                <span className="text-[14px] text-gray-500 font-medium mt-2">Customer satisfaction</span>
              </div>
            </div>
            {/* Stat 4 */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                <Users className="w-8 h-8 text-[#2E7D32]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[26px] font-black tracking-tight leading-none inline-block border-b-4 border-[#4CAF50] pb-1 w-max">950K+</span>
                <span className="text-[14px] text-gray-500 font-medium mt-2">Registered members</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Our customers love us! */}
        <div 
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center relative transition-colors duration-300"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <Heart className="w-8 h-8 text-[#2E7D32] mb-4" strokeWidth={2} />
          <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-center">Our customers love us!</h2>
          <p className="text-[15px] text-gray-500 text-center mt-1 mb-8">Join thousands of satisfied buyers and sellers.</p>

          <div className="w-full max-w-2xl relative">
            {isLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="w-full">
                <div className="flex items-center justify-center gap-1 mb-8">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-6 h-6 ${i < reviews[currentReviewIndex].rating ? "fill-[#2E7D32] text-[#2E7D32]" : "fill-gray-200 text-gray-200"}`} 
                    />
                  ))}
                </div>

                <div className="relative overflow-hidden cursor-grab active:cursor-grabbing">
                  <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                    <motion.div
                      key={currentReviewIndex}
                      custom={direction}
                      variants={{
                        enter: (d: number) => ({ opacity: 0, x: d > 0 ? 50 : -50 }),
                        center: { opacity: 1, x: 0 },
                        exit: (d: number) => ({ opacity: 0, x: d > 0 ? -50 : 50 })
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -50) nextReview();
                        if (info.offset.x > 50) prevReview();
                      }}
                      className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center sm:items-start text-center sm:text-left px-4"
                    >
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 shadow-md border-4 border-white">
                        {reviews[currentReviewIndex].authorImageUrl ? (
                          <img src={reviews[currentReviewIndex].authorImageUrl} alt={reviews[currentReviewIndex].authorName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                            <Users className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col flex-1">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[20px] sm:text-[22px] font-black text-gray-900">{reviews[currentReviewIndex].authorName}</span>
                            <BadgeCheck className="w-5 h-5 text-[#2E7D32] fill-[#2E7D32] text-white" />
                          </div>
                          <span className="text-[13px] sm:text-[14px] text-gray-400 font-bold uppercase tracking-wider">
                            {new Date(reviews[currentReviewIndex].createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        
                        <h3 className="text-[18px] sm:text-[20px] font-black text-[#0A2E1F] mb-3">{reviews[currentReviewIndex].vehicle || "Great experience!"}</h3>
                        <p className="text-[15px] sm:text-[17px] leading-relaxed text-gray-600 font-medium italic">
                          "{reviews[currentReviewIndex].content}"
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex flex-col items-center mt-12 space-y-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full text-[12px] font-black text-[#2E7D32] uppercase tracking-widest border border-green-100">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified customer
                  </div>
                  
                  {reviews.length > 1 && (
                    <div className="flex gap-2.5">
                      {reviews.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentReviewIndex(idx)}
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            idx === currentReviewIndex ? "w-8 bg-[#2E7D32]" : "w-2.5 bg-gray-200 hover:bg-gray-400"
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-10">No reviews available yet.</div>
            )}

            {/* Navigation Arrows */}
            {reviews.length > 1 && (
              <>
                <button 
                  onClick={prevReview}
                  className="hidden sm:flex absolute top-1/2 -left-6 sm:-left-20 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-[0_2px_8px_rgb(0,0,0,0.1)] items-center justify-center hover:bg-gray-50 transition-colors z-10"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button 
                  onClick={nextReview}
                  className="hidden sm:flex absolute top-1/2 -right-6 sm:-right-20 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-[0_2px_8px_rgb(0,0,0,0.1)] items-center justify-center hover:bg-gray-50 transition-colors z-10"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* CARD 3: More happy customers */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <Users className="w-14 h-14 text-[#2E7D32]" strokeWidth={2} />
              <div className="flex flex-col">
                <span className="text-[28px] sm:text-[32px] font-black tracking-tight leading-none">10 000+</span>
                <span className="text-[15px] text-gray-500 mt-1">More happy customers</span>
              </div>
            </div>
            
            <div className="flex items-center">
              {mockAvatars.map((src, i) => (
                <div key={i} className={`w-12 h-12 rounded-full border-2 border-white overflow-hidden ${i !== 0 ? '-ml-3' : ''} shadow-sm z-[${10-i}] relative`}>
                  <img src={src} alt="Customer" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-white bg-[#E8F5E9] text-[#2E7D32] font-bold text-[11px] flex items-center justify-center -ml-3 shadow-sm z-0 relative">
                +9995
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            <div className="flex items-center gap-2 pt-2 sm:pt-0 sm:px-4 text-[13px] sm:text-[14px] font-medium text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-[#2E7D32] fill-[#2E7D32] text-white flex-shrink-0" />
              Trusted by buyers worldwide
            </div>
            <div className="flex items-center gap-2 pt-4 sm:pt-0 sm:px-4 text-[13px] sm:text-[14px] font-medium text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-[#2E7D32] fill-[#2E7D32] text-white flex-shrink-0" />
              Verified customers
            </div>
            <div className="flex items-center gap-2 pt-4 sm:pt-0 sm:px-4 text-[13px] sm:text-[14px] font-medium text-gray-700">
              <CheckCircle2 className="w-5 h-5 text-[#2E7D32] fill-[#2E7D32] text-white flex-shrink-0" />
              Thousands of successful deals
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="flex items-center justify-center gap-2 pt-4 pb-8">
          <Heart className="w-5 h-5 text-[#2E7D32]" strokeWidth={2} />
          <span className="text-[16px] font-bold text-gray-900">Join thousands of satisfied buyers and sellers.</span>
        </div>

      </div>
    </div>
  );
};

export default PromoBanner;