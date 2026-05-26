import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Anchor, Truck, FileText, ClipboardList, Wallet, CheckCircle2, PiggyBank, Users, BarChart3, Diamond, ShieldCheck, ThumbsUp, AlertTriangle, Shield, Car } from "lucide-react";
import { IoDiamondOutline } from "react-icons/io5";
import { GiSlashedShield } from "react-icons/gi";

const VehicleArrival = () => {
   const [slide, setSlide] = useState(0);

   // Scroll to top on slide change
   useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
   }, [slide]);

   // Keyboard Navigation
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "ArrowLeft") {
            setSlide(prev => Math.max(0, prev - 1));
         } else if (e.key === "ArrowRight") {
            setSlide(prev => Math.min(1, prev + 1));
         }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, []);

   // Touch / Mouse Drag Swipe Navigation
   const [touchStart, setTouchStart] = useState<number | null>(null);
   const [touchEnd, setTouchEnd] = useState<number | null>(null);
   const [dragStart, setDragStart] = useState<number | null>(null);
   const [isDragging, setIsDragging] = useState(false);

   const minSwipeDistance = 50;

   const handleTouchStart = (e: React.TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
   };

   const handleTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
   };

   const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      if (distance > minSwipeDistance) {
         setSlide(prev => Math.min(1, prev + 1));
      } else if (distance < -minSwipeDistance) {
         setSlide(prev => Math.max(0, prev - 1));
      }
   };

   const handleMouseDown = (e: React.MouseEvent) => {
      // Allow selecting text inside forms if not dragging
      setDragStart(e.clientX);
      setIsDragging(true);
   };

   const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging || dragStart === null) return;
      const currentX = e.clientX;
      const distance = dragStart - currentX;
      if (Math.abs(distance) > minSwipeDistance) {
         if (distance > minSwipeDistance) {
            setSlide(prev => Math.min(1, prev + 1));
         } else {
            setSlide(prev => Math.max(0, prev - 1));
         }
         setIsDragging(false);
      }
   };

   const handleMouseUp = () => {
      setIsDragging(false);
   };

   return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
         <Header />
         
         <main className="flex-1 pt-24 sm:pt-32 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
            {/* Navigation Dots (Slide Indicator) */}
            <div className="flex gap-2 mb-8 justify-center">
               {[0, 1].map(i => (
                  <button
                     key={i}
                     onClick={() => setSlide(i)}
                     className={`h-2 rounded-full transition-all duration-300 ${slide === i ? 'w-12 bg-[#2f884d]' : 'w-4 bg-gray-200 hover:bg-gray-300'}`}
                     aria-label={`Go to slide ${i + 1}`}
                  />
               ))}
            </div>

            <div 
               className="relative select-none cursor-grab active:cursor-grabbing"
               onTouchStart={handleTouchStart}
               onTouchMove={handleTouchMove}
               onTouchEnd={handleTouchEnd}
               onMouseDown={handleMouseDown}
               onMouseMove={handleMouseMove}
               onMouseUp={handleMouseUp}
               onMouseLeave={handleMouseUp}
            >
               
               {/* Page 1: Vehicle Arrival */}
               {slide === 0 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 bg-white rounded-3xl shadow-xl overflow-hidden relative">
                     
                     {/* 1/2 Tab */}
                     <div 
                        className="absolute top-0 left-0 bg-[#0b4c2a] text-white px-6 sm:px-8 py-2 sm:py-2.5 font-black text-base sm:text-lg tracking-widest z-20 shadow-sm"
                        style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}
                     >
                        1/2
                     </div>

                     {/* TOP HERO SECTION: Image under bg with smooth gradient mask (matching Payment Options page) */}
                     <div 
                        className="relative w-full min-h-[460px] sm:min-h-[480px] lg:min-h-[500px] flex items-center px-6 py-16 sm:px-12 sm:py-20 overflow-hidden bg-cover bg-[position:80%_center] lg:bg-right bg-no-repeat shadow-inner"
                        style={{ backgroundImage: "url('/public_pages/arrival_page_1_1.jpeg')" }}
                     >
                        {/* Smooth white gradient mask for background text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent z-0" />
                        
                        <div className="relative z-10 max-w-2xl w-full pl-2">
                           {/* Header Title - Big, prominent font exactly as mockup */}
                           <div className="mb-4">
                              <h1 className="text-4xl sm:text-5xl md:text-[58px] lg:text-[64px] font-[900] text-[#0b4c2a] uppercase leading-[0.9] tracking-tighter">
                                 VEHICLE ARRIVAL
                              </h1>
                              <h2 className="text-lg sm:text-2xl md:text-[25px] font-[900] text-gray-900 uppercase tracking-[0.05em] mt-3 leading-snug">
                                 & IMPORT PROCESS IN EUROPE
                              </h2>
                           </div>

                           {/* Stars with exact matching dividers */}
                           <div className="flex items-center gap-4 my-6 max-w-[420px]">
                              <div className="h-[1px] bg-gray-300 flex-1"></div>
                              <div className="flex gap-2">
                                 <span className="text-[#0b4c2a] text-xl font-bold">★</span>
                                 <span className="text-[#0b4c2a] text-xl font-bold">★</span>
                                 <span className="text-[#0b4c2a] text-xl font-bold">★</span>
                              </div>
                              <div className="h-[1px] bg-gray-300 flex-1"></div>
                           </div>

                           {/* Section 1 & Paragraphs */}
                           <div className="max-w-[440px] w-full">
                              <div className="flex items-center gap-4 mb-6">
                                 <div 
                                    className="w-10 h-10 bg-[#0b4c2a] text-white flex items-center justify-center font-black text-lg shrink-0"
                                    style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }}
                                 >
                                    1
                                 </div>
                                 <h3 className="text-xl font-[900] text-[#0b4c2a] uppercase tracking-wider">
                                    AT ARRIVAL
                                 </h3>
                              </div>
                              <div className="space-y-4 text-[15px] text-gray-700 leading-relaxed font-semibold">
                                 <p className="font-black text-black text-[16px] leading-snug">
                                    When your vehicle arrives in your country, several import procedures must be completed before delivery.
                                 </p>
                                 <p className="text-gray-700">
                                    This information is provided as examples for <strong className="font-black text-black">France and Belgium</strong>.
                                 </p>
                                 <p className="text-gray-700">
                                    Most European countries follow similar rules, but procedures, taxes and conditions may differ.
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* BOTTOM SECTION: Pure 50% / 50% Split, Left side shifted "a little up" */}
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 px-6 sm:px-10 pb-12 sm:pb-14 md:px-14 md:pb-14 pt-8 relative z-10 items-stretch">
                        {/* Left Column: FIRST STEP card (pure 50% - col-span-6, shifted up with lg:-mt-10) */}
                        <div className="lg:col-span-6 flex items-center lg:-mt-10 relative z-20">
                           <div className="border border-gray-200 rounded-[2rem] p-6 sm:p-8 relative bg-gray-50/50 shadow-sm w-full">
                              <div className="flex flex-col sm:flex-row items-center gap-6">
                                 {/* Left side: Wallet icon inside large green circle */}
                                 <div className="w-20 h-20 bg-[#0b4c2a] rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                                    <Wallet className="w-10 h-10" />
                                 </div>
                                 {/* Right side: stacked text */}
                                 <div className="flex-1 text-center sm:text-left space-y-2">
                                    <h4 className="text-[14px] font-black text-[#0b4c2a] uppercase tracking-widest">
                                       FIRST STEP – TO BE PAID AT ARRIVAL
                                    </h4>
                                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider leading-none">
                                       ESTIMATED TOTAL COSTS TO PAY AT ARRIVAL:
                                    </p>
                                    <div className="flex items-baseline justify-center sm:justify-start gap-2 text-[#0b4c2a]">
                                       <span className="text-5xl font-black tracking-tighter">€650</span>
                                       <span className="text-xs font-bold tracking-widest">APPROX.</span>
                                    </div>
                                    <p className="text-[13px] font-semibold text-gray-600 leading-relaxed">
                                       This amount must be paid at arrival before your vehicle can continue the import process.
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Right Column: 4 items list (pure 50% - col-span-6) with a left gray divider border line */}
                        <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-gray-200 pt-8 lg:pt-0 lg:pl-12 flex flex-col justify-center space-y-5 sm:space-y-6">
                           <div className="flex items-center gap-4 sm:gap-5">
                              <div className="w-12 h-12 bg-[#0b4c2a] rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
                                 <Anchor className="w-6 h-6" />
                              </div>
                              <span className="text-[14px] sm:text-[15px] font-bold text-gray-800">Port handling fees</span>
                           </div>
                           <div className="flex items-center gap-4 sm:gap-5">
                              <div className="w-12 h-12 bg-[#0b4c2a] rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
                                 <Truck className="w-6 h-6" />
                              </div>
                              <span className="text-[14px] sm:text-[15px] font-bold text-gray-800">Container transfer to the shipping partner warehouse</span>
                           </div>
                           <div className="flex items-center gap-4 sm:gap-5">
                              <div className="w-12 h-12 bg-[#0b4c2a] rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
                                 <FileText className="w-6 h-6" />
                              </div>
                              <span className="text-[14px] sm:text-[15px] font-bold text-gray-800">Customs clearance</span>
                           </div>
                           <div className="flex items-center gap-4 sm:gap-5">
                              <div className="w-12 h-12 bg-[#0b4c2a] rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
                                 <ClipboardList className="w-6 h-6" />
                              </div>
                              <span className="text-[14px] sm:text-[15px] font-bold text-gray-800">Administrative import processing</span>
                           </div>
                        </div>
                     </div>

                     {/* Import Taxes Block */}
                     <div className="px-4 sm:px-10 pb-12 md:px-14 md:pb-16 relative z-10">
                        <div className="relative border border-gray-200 rounded-[2rem] p-5 sm:p-8 pt-12 bg-gray-50/50 shadow-sm">
                           {/* Flat Header Title on Border Line */}
                           <div className="absolute -top-4 sm:-top-3.5 left-1/2 -translate-x-1/2 bg-white px-4 sm:px-6 w-[90%] sm:w-auto text-center">
                              <h4 className="text-[11px] sm:text-[14px] font-[900] text-[#0b4c2a] uppercase tracking-[0.1em] sm:tracking-[0.15em] leading-snug py-1">
                                 IMPORT TAXES AFTER PAYMENT AT ARRIVAL
                              </h4>
                           </div>
                           
                           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                              {/* Column 1: RECENT VEHICLES */}
                              <div className="pr-0 pb-6 lg:pr-4 lg:pb-0">
                                 <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-b from-[#1b6b3b] via-[#0b4c2a] to-[#072a16] rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                                       <Car className="w-7 h-7" />
                                    </div>
                                    <div>
                                       <h5 className="font-black text-[#0b4c2a] text-[15px] tracking-wider leading-tight">RECENT VEHICLES</h5>
                                       <p className="font-black text-gray-900 text-[13px] tracking-wide mt-0.5">(1996–2026)</p>
                                    </div>
                                 </div>
                                 <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                       <div className="w-[18px] h-[18px] rounded-full border-2 border-[#adc2b5] shrink-0 mt-0.5"></div>
                                       <span className="text-[13px] font-bold text-gray-800 leading-snug">
                                          Import VAT (TVA) must be paid in Europe*
                                       </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                       <div className="w-[18px] h-[18px] bg-[#0b4c2a] rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                                          <svg className="w-[11px] h-[11px] text-white stroke-white stroke-[3] fill-none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                                       </div>
                                       <span className="text-[13px] font-bold text-gray-800 leading-snug">
                                          Import customs duties apply depending on the country
                                       </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                       <div className="w-[18px] h-[18px] bg-[#0b4c2a] rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                                          <svg className="w-[11px] h-[11px] text-white stroke-white stroke-[3] fill-none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                                       </div>
                                       <span className="text-[13px] font-bold text-gray-800 leading-snug">
                                          Additional local registration taxes may apply
                                       </span>
                                    </li>
                                 </ul>
                              </div>

                              {/* Column 2: CLASSIC VEHICLES */}
                              <div className="py-6 px-0 lg:px-4 lg:py-0">
                                 <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-b from-[#1b6b3b] via-[#0b4c2a] to-[#072a16] rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                                       <Car className="w-7 h-7" />
                                    </div>
                                    <div>
                                       <h5 className="font-black text-[#0b4c2a] text-[15px] tracking-wider leading-tight">CLASSIC VEHICLES</h5>
                                       <p className="font-black text-gray-900 text-[13px] tracking-wide mt-0.5">(30+ YEARS OLD)</p>
                                    </div>
                                 </div>
                                 <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                       <div className="w-[18px] h-[18px] bg-[#0b4c2a] rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                                          <svg className="w-[11px] h-[11px] text-white stroke-white stroke-[3] fill-none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                                       </div>
                                       <div>
                                          <span className="text-[13px] font-bold text-gray-800 leading-snug">Reduced VAT rates may apply*</span>
                                          <p className="text-[11px] font-semibold text-gray-500 mt-0.5">(e.g. 5.5% in France, 6% in Belgium)</p>
                                       </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                       <div className="w-[18px] h-[18px] bg-[#0b4c2a] rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                                          <svg className="w-[11px] h-[11px] text-white stroke-white stroke-[3] fill-none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                                       </div>
                                       <div>
                                          <span className="text-[13px] font-bold text-gray-800 leading-snug">No import customs duties**</span>
                                          <p className="text-[11px] font-semibold text-gray-500 mt-0.5">in many cases</p>
                                       </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                       <div className="w-[18px] h-[18px] bg-[#0b4c2a] rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                                          <svg className="w-[11px] h-[11px] text-white stroke-white stroke-[3] fill-none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                                       </div>
                                       <span className="text-[13px] font-bold text-gray-800 leading-snug">
                                          Lower import taxes compared to recent vehicles
                                       </span>
                                    </li>
                                 </ul>
                              </div>

                              {/* Column 3: Piggy Bank Clearance Option */}
                              <div className="pt-6 pl-0 lg:pl-4 lg:pt-0 flex flex-col items-center justify-center text-center">
                                 <div className="w-16 h-16 bg-gradient-to-b from-[#1b6b3b] via-[#0b4c2a] to-[#072a16] rounded-full flex items-center justify-center text-white mb-4 shadow-md">
                                    <PiggyBank className="w-8 h-8" />
                                 </div>
                                 <p className="text-[13px] font-bold text-gray-800 leading-relaxed max-w-[240px]">
                                    You can also complete customs clearance yourself directly at the customs office and <span className="font-[900] text-black">save approximately €90.</span>
                                 </p>
                              </div>
                           </div>
                        </div>

                        {/* Footnotes */}
                        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-4 sm:px-10 lg:px-[72px] text-[11px] font-bold text-gray-500 gap-4 text-center sm:text-left">
                           <span>* VAT rate depends on the country (e.g. 5.5% in France for classic vehicles).</span>
                           <span>** Under certain conditions and depending on the country.</span>
                        </div>
                     </div>

                     {/* Footer Banner */}
                     <div className="bg-[#0b4c2a] text-white p-6 sm:p-8 px-6 sm:px-12 mt-auto rounded-b-3xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           <div className="flex items-start gap-4">
                              <ShieldCheck className="w-10 h-10 shrink-0" />
                              <div>
                                 <h6 className="font-black text-[13px] tracking-widest uppercase mb-1">TRANSPARENT PROCESS</h6>
                                 <p className="text-[12px] font-medium text-gray-200">No hidden fees, no surprises.</p>
                              </div>
                           </div>
                           <div className="flex items-start gap-4">
                              <div className="w-10 h-10 shrink-0 flex items-center justify-center relative">
                                 {/* Custom Ribbon Award Icon */}
                                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
                                    <circle cx="12" cy="8" r="6"></circle>
                                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                                 </svg>
                              </div>
                              <div>
                                 <h6 className="font-black text-[13px] tracking-widest uppercase mb-1">PROFESSIONAL SUPPORT</h6>
                                 <p className="text-[12px] font-medium text-gray-200">We guide you every step of the way.</p>
                              </div>
                           </div>
                           <div className="flex items-start gap-4">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 shrink-0">
                                 <circle cx="12" cy="12" r="10"></circle>
                                 <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                 <path d="M2 12h20"></path>
                              </svg>
                              <div>
                                 <h6 className="font-black text-[13px] tracking-widest uppercase mb-1">GLOBAL EXPERIENCE</h6>
                                 <p className="text-[12px] font-medium text-gray-200">Importing vehicles worldwide with reliability.</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Page 2: After Arrival */}
               {slide === 1 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 bg-white rounded-3xl shadow-xl overflow-hidden relative">
                     
                     {/* 2/2 Tab - Exactly like Page 1 */}
                     <div 
                        className="absolute top-0 left-0 bg-[#0b4c2a] text-white px-6 sm:px-8 py-2 sm:py-2.5 font-black text-base sm:text-lg tracking-widest z-20 shadow-sm"
                        style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}
                     >
                        2/2
                     </div>

                     {/* TOP HERO SECTION: Image under bg with smooth gradient mask (matching Payment Options page) */}
                     <div 
                        className="relative w-full min-h-[460px] sm:min-h-[480px] lg:min-h-[500px] flex items-center px-6 py-16 sm:px-12 sm:py-20 overflow-hidden bg-cover bg-[position:80%_center] lg:bg-right bg-no-repeat shadow-inner"
                        style={{ backgroundImage: "url('/public_pages/arrival_page_2_1.jpeg')" }}
                     >
                        {/* Smooth white gradient mask for background text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent z-0" />
                        
                        <div className="relative z-10 max-w-2xl w-full pl-2">
                           {/* Header Title - Big, prominent font exactly as mockup */}
                           <div className="mb-4">
                              <h1 className="text-4xl sm:text-5xl md:text-[58px] lg:text-[64px] font-[900] text-[#0b4c2a] uppercase leading-[0.9] tracking-tighter">
                                 AFTER ARRIVAL
                              </h1>
                              <h2 className="text-lg sm:text-2xl md:text-[25px] font-[900] text-gray-900 uppercase tracking-[0.05em] mt-3 leading-snug">
                                 & THE ADVANTAGES OF BUYING IN THE USA
                              </h2>
                           </div>

                           {/* Stars with exact matching dividers */}
                           <div className="flex items-center gap-4 my-6 max-w-[420px]">
                              <div className="h-[1px] bg-gray-300 flex-1"></div>
                              <div className="flex gap-2">
                                 <span className="text-[#0b4c2a] text-xl font-bold">★</span>
                                 <span className="text-[#0b4c2a] text-xl font-bold">★</span>
                                 <span className="text-[#0b4c2a] text-xl font-bold">★</span>
                              </div>
                              <div className="h-[1px] bg-gray-300 flex-1"></div>
                           </div>

                           {/* Section 2: Pickup & Homologation */}
                           <div className="max-w-[440px] w-full">
                              <div className="flex items-center gap-4 mb-6">
                                 <div 
                                    className="w-10 h-10 bg-[#0b4c2a] text-white flex items-center justify-center font-black text-lg shrink-0"
                                    style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }}
                                 >
                                    2
                                 </div>
                                 <h3 className="text-xl font-[900] text-[#0b4c2a] uppercase tracking-wider">
                                    PICKUP & HOMOLOGATION
                                 </h3>
                              </div>
                              <div className="space-y-6 text-[15px] text-gray-700 leading-relaxed font-semibold">
                                 <p className="font-black text-black text-[16px] leading-snug">
                                    Once customs clearance is completed, you may collect your vehicle and proceed with homologation in your country.
                                 </p>
                                 
                                 {/* Helpers info badge with safe opaque background */}
                                 <div className="flex flex-col sm:flex-row items-center gap-5 bg-white/90 backdrop-blur-sm p-5 rounded-[2rem] border border-gray-200 text-left w-full shadow-sm">
                                    <div className="w-14 h-14 bg-gradient-to-b from-[#1b6b3b] via-[#0b4c2a] to-[#072a16] rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                                       <Users className="w-7 h-7" />
                                    </div>
                                    <p className="text-[13px] font-bold text-gray-700 leading-snug">
                                       At your request, we can help you find homologation specialists in your city or country.
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="h-[1px] bg-gray-200 w-full my-8"></div>

                     {/* Section 3: WHY BUY FROM THE USA? */}
                     <div className="p-6 sm:p-10 md:p-14 pt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-12">
                           <div>
                              <div className="flex items-center gap-4 mb-6">
                                 <div 
                                    className="w-10 h-10 bg-[#0b4c2a] text-white flex items-center justify-center font-black text-lg shrink-0"
                                    style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }}
                                 >
                                    3
                                 </div>
                                 <h3 className="text-xl font-black text-[#0b4c2a] uppercase tracking-wider">
                                    WHY BUY FROM THE USA?
                                 </h3>
                              </div>
                              <p className="text-[15px] font-medium text-gray-700 leading-relaxed mb-8">
                                 Buying from the United States is almost always <span className="font-black text-black">more economical</span> and gives you access to a <span className="font-black text-black">wider selection</span> of quality vehicles.
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 mb-10 text-left">
                                 {[
                                    "Direct U.S. dealership pricing",
                                    "Benefit from current exchange rates",
                                    "No intermediaries",
                                    "Large inventory from American dealers",
                                    "You pay the same price as an American",
                                    "Transparent and professional process",
                                    "50% of negotiated savings are deducted",
                                    "Better value for your money",
                                    "Pay in U.S. dollars (USD)"
                                 ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                       <div className="w-[18px] h-[18px] bg-[#0b4c2a] rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                                          <svg className="w-[11px] h-[11px] text-white stroke-white stroke-[3] fill-none" viewBox="0 0 24 24">
                                             <path d="M20 6L9 17l-5-5"/>
                                          </svg>
                                       </div>
                                       <span className="text-[13px] font-bold text-gray-800 leading-snug">{item}</span>
                                    </div>
                                 ))}
                              </div>

                              <div className="bg-[#0b4c2a] text-white p-6 sm:p-8 rounded-[1.8rem] flex flex-col sm:flex-row items-center gap-6 shadow-md text-center sm:text-left">
                                 {/* Circular white-bordered trend-up icon exactly matching mockup */}
                                 <div className="w-[72px] h-[72px] border-[3px] border-white rounded-full flex items-center justify-center shrink-0">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-9 h-9 text-white">
                                       <path d="M3 20h18" strokeLinecap="round"/>
                                       <path d="M5 16v4" strokeLinecap="round"/>
                                       <path d="M9 12v8" strokeLinecap="round"/>
                                       <path d="M13 8v12" strokeLinecap="round"/>
                                       <path d="M17 4v16" strokeLinecap="round"/>
                                       <path d="M4 14l5-4 4-2 6-5" strokeLinecap="round" strokeLinejoin="round"/>
                                       <path d="M15 3h4v4" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                 </div>
                                 <div className="space-y-1">
                                    <h4 className="font-black text-[17px] tracking-wider uppercase">BEFORE PLACING YOUR ORDER</h4>
                                    <p className="text-[13px] font-semibold text-gray-200 leading-relaxed">
                                       We recommend checking the current USD/EUR exchange rate, as favorable rates may create additional savings.
                                    </p>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center justify-center">
                              <img 
                                 src="/public_pages/arrival_page_2_2.jpeg" 
                                 alt="USA Purchase Benefits" 
                                 className="w-full h-auto max-h-[420px] object-contain"
                                 onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550524514-c71d604eb8b3?q=80&w=1000&auto=format&fit=crop';
                                 }}
                              />
                           </div>
                        </div>
                     </div>

                     {/* Footer Banner */}
                     <div className="bg-[#0b4c2a] text-white p-6 sm:p-8 px-6 sm:px-12 mt-auto rounded-b-3xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20">
                           <div className="flex items-center gap-4 pb-6 md:pb-0">
                              <IoDiamondOutline className="w-10 h-10 shrink-0 text-white" />
                              <div className="space-y-0.5">
                                 <h6 className="font-black text-[13px] tracking-wider uppercase">THE BEST VALUE</h6>
                                 <p className="text-[12px] font-medium text-gray-200 leading-snug">Better prices, more choices, more savings.</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4 py-6 md:py-0 md:pl-8">
                              <GiSlashedShield className="w-10 h-10 shrink-0 text-white" />
                              <div className="space-y-0.5">
                                 <h6 className="font-black text-[13px] tracking-wider uppercase">DIRECT ACCESS TO THE U.S. MARKET</h6>
                                 <p className="text-[12px] font-medium text-gray-200 leading-snug">You benefit from a transparent, secure, and professional buying experience.</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4 pt-6 md:pt-0 md:pl-8">
                              {/* Circle thumbs up icon matching mockup */}
                              <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                 <ThumbsUp className="w-5.5 h-5.5 text-[#0b4c2a] fill-[#0b4c2a]" />
                              </div>
                              <div className="space-y-0.5">
                                 <h6 className="font-black text-[13px] tracking-wider uppercase">BUY SMART, SAVE MORE</h6>
                                 <p className="text-[12px] font-medium text-gray-200 leading-snug">Quality vehicles, better prices, real advantages.</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Centered warning section below the green banner exactly matching mockup */}
                     <div className="flex items-center justify-center gap-4 mt-8 mb-4 px-4 text-center sm:text-left">
                        <AlertTriangle className="w-8 h-8 text-gray-800 shrink-0 stroke-[1.8]" />
                        <span className="text-[14px] sm:text-[15px] font-black text-gray-800 leading-relaxed">
                           We recommend clients check local regulations in their country,<br />
                           as import taxes and homologation requirements may vary.
                        </span>
                     </div>
                  </div>
               )}

               {/* Navigation Controls */}
               <div className="flex flex-col sm:flex-row items-center justify-between mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-gray-100 gap-6">
                  <Button
                     variant="outline"
                     onClick={() => setSlide(Math.max(0, slide - 1))}
                     disabled={slide === 0}
                     className={`h-14 px-8 rounded-xl font-bold text-[15px] transition-all border-2 w-full sm:w-auto ${slide === 0 ? 'opacity-0 invisible' : 'hover:bg-gray-50 hover:text-[#2f884d] hover:border-[#2f884d]'}`}
                  >
                     <ArrowLeft className="w-5 h-5 mr-3" /> Previous Page
                  </Button>

                  <div className="flex flex-col items-center order-first sm:order-none">
                     <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Navigation</span>
                     <span className="text-[16px] font-black text-[#1b2533] uppercase tracking-widest bg-gray-100 px-4 py-1.5 rounded-lg">Page {slide + 1} of 2</span>
                  </div>

                  <Button
                     variant="default"
                     onClick={() => setSlide(Math.min(1, slide + 1))}
                     disabled={slide === 1}
                     className={`h-14 px-8 rounded-xl bg-[#2f884d] hover:bg-[#25733f] text-white font-bold text-[15px] shadow-lg shadow-green-500/20 transition-all hover:scale-105 active:scale-95 border-none w-full sm:w-auto ${slide === 1 ? 'opacity-0 invisible' : ''}`}
                  >
                     Next Page <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
               </div>

            </div>
         </main>
         <Footer />
      </div>
   );
};

export default VehicleArrival;
