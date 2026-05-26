import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
   Star, Target, Scale,
   HeadphonesIcon, Globe, Lock, Globe2, CheckCircle2,
   FileText, DollarSign, User, Building, Info, Car, Truck,
   ArrowLeft, ArrowRight
} from "lucide-react";
import { FaHandshake } from "react-icons/fa";
import { RiShieldCheckFill } from "react-icons/ri";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { RiGlobalFill } from "react-icons/ri";
import { IoIosLock } from "react-icons/io";


const PaymentOptions = () => {
   const [slide, setSlide] = useState(0);

   useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
   }, [slide]);

   // Keyboard Navigation
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "ArrowLeft") {
            setSlide(prev => Math.max(0, prev - 1));
         } else if (e.key === "ArrowRight") {
            setSlide(prev => Math.min(2, prev + 1));
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
         setSlide(prev => Math.min(2, prev + 1));
      } else if (distance < -minSwipeDistance) {
         setSlide(prev => Math.max(0, prev - 1));
      }
   };

   const handleMouseDown = (e: React.MouseEvent) => {
      setDragStart(e.clientX);
      setIsDragging(true);
   };

   const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging || dragStart === null) return;
      const currentX = e.clientX;
      const distance = dragStart - currentX;
      if (Math.abs(distance) > minSwipeDistance) {
         if (distance > minSwipeDistance) {
            setSlide(prev => Math.min(2, prev + 1));
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
      <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans">
         <Header />
         <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">

            {/* Navigation Tabs (Optional visual indicator) */}
            <div className="flex gap-2 mb-8 justify-center">
               {[0, 1, 2].map(i => (
                  <button
                     key={i}
                     onClick={() => setSlide(i)}
                     className={`h-2 rounded-full transition-all duration-300 ${slide === i ? 'w-12 bg-[#2f884d]' : 'w-4 bg-gray-200 hover:bg-gray-300'}`}
                     aria-label={`Go to slide ${i + 1}`}
                  />
               ))}
            </div>

            <div 
                className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_50px_rgb(0,0,0,0.04)] border border-gray-100 min-h-[800px] select-none cursor-grab active:cursor-grabbing"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
             >

               {slide === 0 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 bg-white">

                     {/* Hero Section */}
                     <div className="relative mb-12 rounded-[2rem] overflow-hidden min-h-[480px] bg-[url('/public_pages/Negotiation.jpeg')] bg-cover bg-right bg-no-repeat p-8 sm:p-12 flex items-center shadow-inner">
                        {/* Premium smooth white gradient mask for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent z-0" />

                        <div className="relative z-10 space-y-6 max-w-2xl pl-2">
                           <h1 className="text-3xl sm:text-[46px] md:text-[56px] font-[900] tracking-tight leading-[1.02] uppercase">
                              <span className="text-black block">PAYMENT OPTIONS &</span>
                              <span className="text-[#0b4c2a] block">NEGOTIATED SAVINGS</span>
                           </h1>

                           <div className="flex items-center gap-4 max-w-md">
                              <div className="h-[1.5px] bg-gray-200/80 flex-1"></div>
                              <div className="flex gap-2">
                                 <Star className="w-4 h-4 fill-[#0b4c2a] text-[#0b4c2a]" />
                                 <Star className="w-4 h-4 fill-[#0b4c2a] text-[#0b4c2a]" />
                                 <Star className="w-4 h-4 fill-[#0b4c2a] text-[#0b4c2a]" />
                              </div>
                              <div className="h-[1.5px] bg-gray-200/80 flex-1"></div>
                           </div>

                           <p className="text-[17px] text-gray-800 font-medium leading-relaxed max-w-xl">
                              We help clients worldwide purchase American vehicles at the best possible negotiated prices while providing a <span className="font-bold text-[#1b703a]">transparent, professional, and secure buying experience.</span>
                           </p>

                           <div className="flex gap-4 items-center pt-2">
                              <div className="w-12 h-12 rounded-full bg-[#0b4c2a] flex items-center justify-center flex-shrink-0 shadow-md">
                                 <Target className="w-6 h-6 text-white" />
                              </div>
                              <p className="text-[14px] font-semibold text-gray-700 max-w-md leading-snug">
                                 Our goal is simple: negotiate the best deal possible for our clients while offering flexible payment solutions adapted to each buyer's needs.
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* How Negotiated Savings Work */}
                     <div className="mb-12">
                        <div className="border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 max-w-[95%] mx-auto bg-white shadow-sm">
                           <div className="w-[85px] h-[85px] rounded-full bg-[#003B21] flex items-center justify-center flex-shrink-0 shadow-md">
                              <Scale className="w-11 h-11 text-white" />
                           </div>
                           <div className="text-center md:text-left">
                              <h3 className="text-[19px] font-bold text-[#003B21] uppercase tracking-wide mb-1.5">How Negotiated Savings Work</h3>
                              <p className="text-[15px] font-medium text-gray-800 leading-snug">
                                 If we successfully negotiate a lower purchase price, the negotiated savings are shared 50/50 between the client and our company.
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* Client Benefits */}
                     <div className="mb-16 mt-16">
                        <div className="flex items-center justify-center gap-4 mb-8">
                           <div className="h-[1px] bg-gray-200 flex-1 max-w-[150px]"></div>
                           <h2 className="text-[17px] font-bold text-[#003B21] uppercase tracking-widest">Client Benefits</h2>
                           <div className="h-[1px] bg-gray-200 flex-1 max-w-[150px]"></div>
                        </div>

                        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
                           {[
                              { icon: FaHandshake, title: "Professional", title2: "Negotiation", desc: "We negotiate on your behalf to get the best deal." },
                              { icon: RiShieldCheckFill, title: "Transparent", title2: "Process", desc: "No hidden fees, complete clarity at every step." },
                              { icon: TfiHeadphoneAlt, title: "Dedicated", title2: "Support", desc: "A single point of contact from start to finish." },
                              { icon: RiGlobalFill, title: "Global", title2: "Experience", desc: "We export vehicles worldwide with reliability." },
                              { icon: IoIosLock, title: "Secure", title2: "Transactions", desc: "Your payments and information are protected." }
                           ].map((b, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center text-center px-4 py-6 md:py-0">
                                 <b.icon className="w-10 h-10 text-[#003B21] mb-3" />
                                 <div className="mb-3 h-8 flex flex-col justify-center">
                                    <h4 className="font-bold text-[11px] text-[#003B21] uppercase tracking-wide leading-tight">{b.title}</h4>
                                    <h4 className="font-bold text-[11px] text-[#003B21] uppercase tracking-wide leading-tight">{b.title2}</h4>
                                 </div>
                                 <p className="text-[11px] text-gray-800 font-medium leading-relaxed">{b.desc}</p>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* International Currency Advantage */}
                     <div className="relative border border-gray-200 rounded-2xl p-8 pt-10 mb-8 max-w-[95%] mx-auto bg-white">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 whitespace-nowrap">
                           <h3 className="text-[15px] font-bold text-[#0b4c2a] uppercase tracking-widest">International Currency Advantage</h3>
                        </div>
                        <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
                           <div className="flex-shrink-0 relative">
                              <svg viewBox="0 0 200 200" className="w-48 h-48 select-none">
                                 <defs>
                                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0b4c2a" />
                                    </marker>
                                 </defs>
                                 
                                 {/* Central Globe */}
                                 <circle cx="100" cy="100" r="38" fill="#0b4c2a" />
                                 
                                 {/* Earth map detail in white */}
                                 <path d="M 80 80 c 2 -5, 10 -2, 12 -8 c 4 2, 5 8, 10 6 c 2 -3, 6 -5, 5 -10 c -5 -1, -8 4, -12 2 c -3 -5, 2 -8, -2 -11 c -6 2, -7 8, -13 6 z" fill="#ffffff" opacity="0.95" />
                                 <path d="M 115 110 c 3 2, 8 1, 10 -4 c -2 -3, -8 -2, -10 2 z" fill="#ffffff" opacity="0.95" />
                                 <path d="M 90 120 c 4 2, 8 -3, 12 1 c 1 4, -4 6, -8 4 c -3 2, -2 -3, -6 -5 z" fill="#ffffff" opacity="0.95" />
                                 <path d="M 72 102 c 2 -3, 6 -1, 5 3 c -2 2, -6 -1, -5 -3 z" fill="#ffffff" opacity="0.95" />
                                 
                                 {/* Euro Badge (Left) */}
                                 <circle cx="32" cy="100" r="18" fill="#0b4c2a" />
                                 <text x="32" y="106" fontFamily="sans-serif" fontSize="19" fontWeight="900" fill="#ffffff" textAnchor="middle">€</text>
                                 
                                 {/* Dollar Badge (Right) */}
                                 <circle cx="168" cy="100" r="18" fill="#0b4c2a" />
                                 <text x="168" y="106" fontFamily="sans-serif" fontSize="19" fontWeight="900" fill="#ffffff" textAnchor="middle">$</text>
                                 
                                 {/* Curved Arrows (Clockwise Cycle) */}
                                 <path d="M 38 75 A 65 65 0 0 1 80 40" fill="none" stroke="#0b4c2a" strokeWidth="2.5" markerEnd="url(#arrow)" />
                                 <path d="M 120 40 A 65 65 0 0 1 162 75" fill="none" stroke="#0b4c2a" strokeWidth="2.5" markerEnd="url(#arrow)" />
                                 <path d="M 162 125 A 65 65 0 0 1 120 160" fill="none" stroke="#0b4c2a" strokeWidth="2.5" markerEnd="url(#arrow)" />
                                 <path d="M 80 160 A 65 65 0 0 1 38 125" fill="none" stroke="#0b4c2a" strokeWidth="2.5" markerEnd="url(#arrow)" />
                              </svg>
                           </div>
                           <ul className="space-y-4 max-w-xl">
                              {[
                                 "All vehicle invoices are issued in U.S. dollars (USD).",
                                 "Depending on your country and currency exchange rate, you may benefit from favorable exchange rates.",
                                 "In many cases, this currency advantage can create additional savings compared to purchasing locally.",
                                 "We recommend checking the current USD exchange rate before placing your order."
                              ].map((item, i) => (
                                 <li key={i} className="flex gap-3 items-start">
                                    <CheckCircle2 className="w-5.5 h-5.5 text-white fill-[#0b4c2a] flex-shrink-0 stroke-[2.5] mt-0.5" />
                                    <span className="text-gray-800 font-medium text-[13px]">{item}</span>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>

                     {/* Footer Green Bar */}
                     <div className="bg-[#003B21] text-white py-6 px-4 md:px-8 flex flex-col md:flex-row justify-between divide-y md:divide-y-0 md:divide-x divide-white/20 mt-12">
                        <div className="flex-1 flex items-center gap-4 px-4 py-2 md:py-0">
                           <RiShieldCheckFill className="w-10 h-10 text-white flex-shrink-0 stroke-[1.5]" />
                           <div>
                              <h4 className="font-bold uppercase tracking-widest text-[12px] mb-0.5 text-white">Experience</h4>
                              <p className="text-[11px] text-white/90 font-medium leading-tight">Years of experience<br />in vehicle export.</p>
                           </div>
                        </div>
                        <div className="flex-1 flex items-center gap-4 px-4 py-2 md:py-0">
                           <CheckCircle2 className="w-10 h-10 text-white flex-shrink-0 stroke-[1.5]" />
                           <div>
                              <h4 className="font-bold uppercase tracking-widest text-[12px] mb-0.5 text-white">Transparency</h4>
                              <p className="text-[11px] text-white/90 font-medium leading-tight">Clear process and<br />honest communication.</p>
                           </div>
                        </div>
                        <div className="flex-1 flex items-center gap-4 px-4 py-2 md:py-0">
                           <Globe className="w-10 h-10 text-white flex-shrink-0 stroke-[1.5]" />
                           <div>
                              <h4 className="font-bold uppercase tracking-widest text-[12px] mb-0.5 text-white">Trust</h4>
                              <p className="text-[11px] text-white/90 font-medium leading-tight">Your satisfaction<br />is our priority.</p>
                           </div>
                        </div>
                     </div>

                     {/* Pagination Black Bar */}
                     <div className="bg-[#1b2533] text-white py-3 px-8 flex items-center justify-between rounded-b-[2.5rem]">
                        <div className="flex-1"></div>
                        <span className="text-[13px] font-bold text-white uppercase tracking-widest flex-1 text-center">Page 1 of 3</span>
                        <div className="flex-1 flex justify-end">
                           <button onClick={() => setSlide(1)} className="text-[#60E677] font-bold text-[13px] uppercase tracking-wider flex items-center gap-1 hover:text-white transition-colors">
                              Next Page <ArrowRight className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
               )}

               {slide === 1 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 bg-white">
                     {/* Header Banner */}
                     <div className="bg-[#0b4c2a] text-white p-6 sm:p-8 flex justify-between items-center -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 rounded-t-[2.5rem] mb-10 shadow-md">
                        <div className="space-y-4">
                           <span className="bg-white text-[#0b4c2a] px-4 py-1.5 rounded-lg text-[13px] font-black tracking-widest uppercase inline-block shadow-sm">Option 1</span>
                           <h1 className="text-2xl sm:text-3xl md:text-[34px] font-[900] uppercase tracking-tight leading-[1.1]">
                              <span className="block">Direct Payment</span>
                              <span className="block">To The Seller</span>
                           </h1>
                        </div>
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
                           <FaHandshake className="w-11 h-11 text-[#0b4c2a]" />
                        </div>
                     </div>

                     {/* How It Works Divider */}
                     <div className="flex items-center gap-4 mt-8 mb-8">
                        <h3 className="text-[14px] font-bold text-[#0b4c2a] uppercase tracking-widest whitespace-nowrap">How It Works</h3>
                        <div className="h-[1px] bg-gray-200 flex-1"></div>
                     </div>

                     {/* How It Works List */}
                     <ul className="space-y-6 mb-10 pl-2">
                        <li className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-full bg-[#0b4c2a] flex items-center justify-center flex-shrink-0 shadow-md">
                              <FileText className="w-5.5 h-5.5 text-white" />
                           </div>
                           <span className="text-[15px] font-bold text-gray-700 leading-tight">The seller issues the invoice directly to the client</span>
                        </li>
                        <li className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-full bg-[#0b4c2a] flex items-center justify-center flex-shrink-0 shadow-md">
                              <DollarSign className="w-5.5 h-5.5 text-white" />
                           </div>
                           <span className="text-[15px] font-bold text-gray-700 leading-tight">The client pays the seller directly</span>
                        </li>
                        <li className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-full bg-[#0b4c2a] flex items-center justify-center flex-shrink-0 shadow-md">
                              <User className="w-5.5 h-5.5 text-white" />
                           </div>
                           <span className="text-[15px] font-bold text-gray-700 leading-tight">We negotiate the best possible purchase price on the client's behalf</span>
                        </li>
                     </ul>

                     {/* Negotiation Example Divider */}
                     <div className="flex items-center gap-4 mt-12 mb-8">
                        <h3 className="text-[14px] font-bold text-[#0b4c2a] uppercase tracking-widest whitespace-nowrap">Negotiation Example</h3>
                        <div className="h-[1px] bg-gray-200 flex-1"></div>
                     </div>

                     {/* Price breakdown */}
                     <div className="space-y-4 mb-8 max-w-xl pl-2">
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700 font-semibold text-[15px]">Advertised vehicle price:</span>
                           <span className="font-bold text-gray-900 text-[15px]">$25,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-700 font-semibold text-[15px]">Negotiated vehicle price:</span>
                           <span className="font-bold text-gray-900 text-[15px]">$20,000</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                           <span className="text-[#0b4c2a] font-bold text-[16px]">Total negotiated savings:</span>
                           <span className="font-black text-xl text-[#0b4c2a]">$5,000</span>
                        </div>
                     </div>

                     {/* Savings Split Cards */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 pl-2">
                        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm">
                           <div className="w-12 h-12 bg-[#0b4c2a] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                              <User className="w-6 h-6 text-white" />
                           </div>
                           <div>
                              <p className="text-[11px] font-bold text-[#0b4c2a] uppercase tracking-wide">Client Savings</p>
                              <p className="text-[10px] text-gray-500 font-medium mb-1">(50%)</p>
                              <p className="text-xl font-black text-gray-900">$2,500</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm">
                           <div className="w-12 h-12 bg-[#0b4c2a] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                              <Building className="w-6 h-6 text-white" />
                           </div>
                           <div>
                              <p className="text-[11px] font-bold text-[#0b4c2a] uppercase tracking-wide">Our Negotiation Fee</p>
                              <p className="text-[10px] text-gray-500 font-medium mb-1">(50%)</p>
                              <p className="text-xl font-black text-gray-900">$2,500</p>
                           </div>
                        </div>
                     </div>

                     {/* Our Service Fee Covers Border Card */}
                     <div className="relative border border-gray-200 rounded-2xl p-6 pt-10 mb-8 max-w-[95%] mx-auto bg-white">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 whitespace-nowrap">
                           <h3 className="text-[13px] font-bold text-[#0b4c2a] uppercase tracking-widest">Our Service Fee Covers:</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                           <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-5.5 h-5.5 text-white fill-[#0b4c2a] flex-shrink-0 stroke-[2.5]" />
                              <span className="text-[14px] font-bold text-gray-700">Vehicle sourcing</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-5.5 h-5.5 text-white fill-[#0b4c2a] flex-shrink-0 stroke-[2.5]" />
                              <span className="text-[14px] font-bold text-gray-700">International buyer support</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-5.5 h-5.5 text-white fill-[#0b4c2a] flex-shrink-0 stroke-[2.5]" />
                              <span className="text-[14px] font-bold text-gray-700">Negotiation with the seller</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-5.5 h-5.5 text-white fill-[#0b4c2a] flex-shrink-0 stroke-[2.5]" />
                              <span className="text-[14px] font-bold text-gray-700">Communication and coordination throughout the process</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-5.5 h-5.5 text-white fill-[#0b4c2a] flex-shrink-0 stroke-[2.5]" />
                              <span className="text-[14px] font-bold text-gray-700">Transaction assistance</span>
                           </div>
                        </div>
                     </div>

                     {/* Info Box */}
                     <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-150 mx-auto max-w-2xl text-left shadow-sm mb-12">
                        <div className="w-10 h-10 rounded-full bg-[#0b4c2a] flex items-center justify-center flex-shrink-0 shadow-sm">
                           <Info className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[13px] font-semibold text-gray-700 leading-relaxed">
                           This fee is our negotiation and sourcing service fee for securing the best possible deal on your behalf.
                        </span>
                     </div>
                  </div>
               )}

               {slide === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 bg-white">
                     {/* Header Banner */}
                     <div className="bg-[#0b4c2a] text-white p-6 sm:p-8 flex justify-between items-center -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 rounded-t-[2.5rem] mb-10 shadow-md">
                        <div className="space-y-4">
                           <span className="bg-white text-[#0b4c2a] px-4 py-1.5 rounded-lg text-[13px] font-black tracking-widest uppercase inline-block shadow-sm">Option 2</span>
                           <h1 className="text-2xl sm:text-3xl md:text-[34px] font-[900] uppercase tracking-tight leading-[1.1]">
                              <span className="block">SecurePay Payment</span>
                              <span className="block">Management Service</span>
                           </h1>
                        </div>
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
                           <RiShieldCheckFill className="w-11 h-11 text-[#0b4c2a]" />
                        </div>
                     </div>

                     {/* How It Works Divider */}
                     <div className="flex items-center gap-4 mt-8 mb-8">
                        <h3 className="text-[14px] font-bold text-[#0b4c2a] uppercase tracking-widest whitespace-nowrap">How It Works</h3>
                        <div className="h-[1px] bg-gray-200 flex-1"></div>
                     </div>

                     {/* How It Works List */}
                     <ul className="space-y-6 mb-10 pl-2">
                        <li className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-full bg-[#0b4c2a] flex items-center justify-center flex-shrink-0 shadow-md">
                              <Lock className="w-5.5 h-5.5 text-white" />
                           </div>
                           <span className="text-[15px] font-bold text-gray-700 leading-tight">We receive and manage the payment securely</span>
                        </li>
                        <li className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-full bg-[#0b4c2a] flex items-center justify-center flex-shrink-0 shadow-md">
                              <Globe className="w-5.5 h-5.5 text-white" />
                           </div>
                           <span className="text-[15px] font-bold text-gray-700 leading-tight">We coordinate directly with the seller</span>
                        </li>
                        <li className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-full bg-[#0b4c2a] flex items-center justify-center flex-shrink-0 shadow-md">
                              <User className="w-5.5 h-5.5 text-white" />
                           </div>
                           <span className="text-[15px] font-bold text-gray-700 leading-tight">One single point of contact throughout the transaction</span>
                        </li>
                        <li className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-full bg-[#0b4c2a] flex items-center justify-center flex-shrink-0 shadow-md">
                              <Truck className="w-5.5 h-5.5 text-white" />
                           </div>
                           <span className="text-[15px] font-bold text-gray-700 leading-tight">Additional support for export and logistics coordination</span>
                        </li>
                     </ul>

                     {/* SecurePay Service Fees Divider */}
                     <div className="flex items-center gap-4 mt-12 mb-8">
                        <div className="h-[1px] bg-gray-200 flex-1"></div>
                        <h3 className="text-[14px] font-bold text-[#0b4c2a] uppercase tracking-widest whitespace-nowrap">SecurePay Service Fees</h3>
                        <div className="h-[1px] bg-gray-200 flex-1"></div>
                     </div>

                     {/* Fee Cards Border Box */}
                     <div className="border border-gray-200 rounded-2xl p-6 mb-6 bg-white shadow-sm pl-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:divide-x divide-gray-150">
                           <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-[#0b4c2a] rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                                 <FileText className="w-7 h-7" />
                              </div>
                              <div className="leading-tight">
                                 <p className="text-xl font-bold text-[#0b4c2a] mb-0.5">$350</p>
                                 <p className="text-[13px] font-bold text-gray-700 leading-snug">
                                    Administration and<br />file setup fee
                                 </p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4 md:pl-8">
                              <div className="w-14 h-14 bg-[#0b4c2a] rounded-full flex items-center justify-center flex-shrink-0 text-white font-black text-xl shadow-sm">
                                 3%
                              </div>
                              <div className="leading-tight">
                                 <p className="text-[13px] font-bold text-gray-700 leading-snug">
                                    SecurePay service fee<br />based on the negotiated<br />vehicle price
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Scale Row */}
                     <div className="flex items-center gap-4 pl-2 mb-10 mt-6">
                        <Scale className="w-11 h-11 text-[#0b4c2a] flex-shrink-0" />
                        <span className="text-[15px] font-bold text-gray-700 leading-snug">
                           The negotiated savings obtained with the seller<br />are still shared 50/50 with the client.
                        </span>
                     </div>                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pl-2">
                        {/* Example with SecurePay Box */}
                        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                           <div className="bg-[#0b4c2a] text-white text-center py-3.5 text-[14px] font-black tracking-wider uppercase">
                              Example with SecurePay
                           </div>
                           <div className="p-6 space-y-4">
                              <div className="flex justify-between items-center text-[14px]">
                                 <span className="text-gray-600 font-semibold">Advertised vehicle price:</span>
                                 <span className="font-bold text-gray-900">$25,000</span>
                              </div>
                              <div className="flex justify-between items-center text-[14px]">
                                 <span className="text-gray-600 font-semibold">Negotiated vehicle price:</span>
                                 <span className="font-bold text-gray-900">$20,000</span>
                              </div>
                              <div className="flex justify-between items-center text-[14px] pt-2 border-t border-gray-150">
                                 <span className="text-[#0b4c2a] font-bold">Total negotiated savings:</span>
                                 <span className="font-black text-lg text-[#0b4c2a]">$5,000</span>
                              </div>
                           </div>
                        </div>

                        {/* Savings Distribution Box */}
                        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white p-6 flex flex-col justify-center gap-5">
                           <h4 className="text-[14px] font-black text-[#0b4c2a] uppercase tracking-wider mb-5">
                              Negotiated Savings Distribution
                           </h4>
                           <div className="flex items-center gap-4">
                              <div className="w-11 h-11 bg-[#0b4c2a] rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                                 <User className="w-5.5 h-5.5" />
                              </div>
                              <div>
                                 <p className="text-[13px] font-semibold text-gray-700 leading-none mb-1">Client savings (50%)</p>
                                 <p className="font-black text-lg text-[#0b4c2a]">$2,500</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="w-11 h-11 bg-[#0b4c2a] rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                                 <Building className="w-5.5 h-5.5" />
                              </div>
                              <div>
                                 <p className="text-[13px] font-semibold text-gray-700 leading-none mb-1">Our service fee (50%)</p>
                                 <p className="font-black text-lg text-[#0b4c2a]">$2,500</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pl-2">
                        {/* SecurePay Fees Card */}
                        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                           <div className="py-3.5 text-[14px] font-black text-[#0b4c2a] uppercase tracking-wider pl-6">
                              SecurePay Fees
                           </div>
                           <div className="p-6 space-y-3">
                              <div className="flex justify-between items-center text-[13px]">
                                 <span className="text-gray-600 font-semibold">SecurePay service fee (3% of $20,000):</span>
                                 <span className="font-black text-gray-900">$600</span>
                              </div>
                              <div className="flex justify-between items-center text-[13px]">
                                 <span className="text-gray-600 font-semibold">Administration and file setup fee:</span>
                                 <span className="font-black text-gray-900">$350</span>
                              </div>
                           </div>
                        </div>

                        {/* Total Paid by Client Card */}
                        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                           <div className="bg-[#0b4c2a] text-white text-center py-3.5 text-[14px] font-black tracking-wider uppercase">
                              Total Paid By Client
                           </div>
                           <div className="p-6 space-y-3">
                              <div className="flex justify-between items-center text-[13px]">
                                 <span className="text-gray-600 font-semibold">Negotiated vehicle price:</span>
                                 <span className="font-bold text-gray-900">$20,000</span>
                              </div>
                              <div className="flex justify-between items-center text-[13px]">
                                 <span className="text-gray-600 font-semibold">SecurePay service fee:</span>
                                 <span className="font-bold text-gray-900">$600</span>
                              </div>
                              <div className="flex justify-between items-center text-[13px]">
                                 <span className="text-gray-600 font-semibold">Administration fee:</span>
                                 <span className="font-bold text-gray-900">$350</span>
                              </div>
                              <div className="flex justify-between items-center pt-3 border-t border-gray-150">
                                 <span className="text-gray-900 font-black text-[15px] uppercase">TOTAL:</span>
                                 <span className="font-black text-2xl text-[#0b4c2a]">$20,950</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Client Benefits Card */}
                     <div className="relative border border-gray-200 rounded-[2rem] p-6 pt-10 pb-8 mb-12 bg-white shadow-sm max-w-full">
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white px-5 whitespace-nowrap">
                           <h4 className="text-[12px] font-black text-[#0b4c2a] uppercase tracking-widest">
                              The Client Benefits From:
                           </h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-2">
                           {[
                              { icon: FaHandshake, text1: "Professional", text2: "negotiation" },
                              { icon: RiShieldCheckFill, text1: "Secure payment", text2: "management" },
                              { icon: HeadphonesIcon, text1: "Transaction", text2: "assistance" },
                              { icon: Truck, text1: "Export & logistics", text2: "support" },
                              { icon: CheckCircle2, text1: "Transparent & secure", text2: "purchasing process" }
                           ].map((b, i) => (
                              <div key={i} className="flex flex-col items-center text-center group">
                                 <b.icon className="w-11 h-11 text-[#0b4c2a] transition-transform duration-300 group-hover:scale-110" />
                                 <div className="mt-4">
                                    <p className="text-[12px] font-bold text-gray-700 leading-snug">{b.text1}</p>
                                    <p className="text-[12px] font-bold text-gray-700 leading-snug">{b.text2}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {/* Navigation Controls */}
               <div className="flex flex-col sm:flex-row items-center justify-between mt-12 pt-8 border-t-2 border-gray-100 gap-6">
                  <Button
                     variant="outline"
                     onClick={() => setSlide(Math.max(0, slide - 1))}
                     disabled={slide === 0}
                     className={`h-14 px-8 rounded-xl font-bold text-[15px] transition-all border-2 ${slide === 0 ? 'opacity-0 invisible' : 'hover:bg-gray-50 hover:text-[#2f884d] hover:border-[#2f884d]'}`}
                  >
                     <ArrowLeft className="w-5 h-5 mr-3" /> Previous Page
                  </Button>

                  <div className="flex flex-col items-center">
                     <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Navigation</span>
                     <span className="text-[16px] font-black text-[#1b2533] uppercase tracking-widest bg-gray-100 px-4 py-1.5 rounded-lg">Page {slide + 1} of 3</span>
                  </div>

                  <Button
                     variant="default"
                     onClick={() => setSlide(Math.min(2, slide + 1))}
                     disabled={slide === 2}
                     className={`h-14 px-8 rounded-xl bg-[#2f884d] hover:bg-[#25733f] text-white font-bold text-[15px] shadow-lg shadow-green-500/20 transition-all hover:scale-105 active:scale-95 border-none ${slide === 2 ? 'opacity-0 invisible' : ''}`}
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

export default PaymentOptions;
