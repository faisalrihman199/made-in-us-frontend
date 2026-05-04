import React, { useState } from 'react';
import Header from '@/components/Header';
import { Check, Shield, Ship, FileSearch, ChevronRight, Lock, ChevronDown, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SecurePay = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Header />
      
      {/* Main Content Container */}
      <main className="flex-1 relative pb-20">
        
        {/* Background Image / Hero Area */}
        <div className="absolute top-0 w-full h-[500px] overflow-hidden bg-[#e9ecef]">
           {/* Fallback pattern / gradient if image doesn't load fully */}
           <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9fa] via-[#e2e8f0]/80 to-transparent z-10" />
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f8f9fa] z-10" />
           
           {/* Using an image that resembles international car shipping vibe. */}
           <img 
            src="https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=2000&auto=format&fit=crop" 
            alt="Car and Shipping" 
            className="w-full h-full object-cover object-center opacity-90"
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-16">
          
          {/* Header Text */}
          <div className="max-w-2xl text-[#0b2447] mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] tracking-tight mb-6">
              <br />
              Buy U.S. Vehicles<br />
              Safely and Securely
            </h1>
            <p className="text-xl md:text-[22px] text-slate-700/90 leading-relaxed max-w-xl font-medium">
              The safest escrow payment system for buying and exporting vehicles from the United States.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-[24px] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] mb-12 relative overflow-hidden">
            {/* Decorative money/shield icon overlay for the top right */}
            <div className="absolute -top-6 -right-6 w-48 h-48 opacity-20 pointer-events-none hidden md:block">
               <Shield className="w-full h-full text-emerald-600" />
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight">
                Made-in-US SecurePay
              </h2>
            </div>

            <p className="text-lg md:text-[19px] text-slate-700 mb-8 leading-relaxed max-w-4xl">
              This vehicle is eligible for <span className="font-bold text-slate-900">Made-in-US SecurePay</span>, our secure payment system designed for international buyers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 mb-10 max-w-3xl">
              {[
                "Secure escrow payment",
                "Buyer protection",
                "Verified vehicle condition",
                "International purchases made simple"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                  </div>
                  <span className="text-lg text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <p className="text-[22px] text-slate-900">
                <strong className="font-bold">The safest way to buy</strong> <em className="text-slate-600 font-serif">vehicles from the United States.</em>
              </p>
            </div>

            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-[#107050] hover:bg-[#0c5940] text-white px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20 w-fit group"
              >
                Learn more about SecurePay
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* Expandable Details Area */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isExpanded ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="bg-emerald-50/50 rounded-2xl p-6 md:p-8 border border-emerald-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Shield className="w-24 h-24 text-emerald-900" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">SecurePay Deep Dive</h3>
                    </div>

                    <div className="space-y-6 max-w-3xl">
                      <p className="text-lg text-slate-700 leading-relaxed">
                        Made-in-US SecurePay is specifically engineered to eliminate the risks associated with international vehicle commerce. 
                        By acting as a neutral third party, we ensure both the capital and the vehicle title are verified before any transfer occurs.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/60 p-6 rounded-xl border border-emerald-50 shadow-sm">
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-slate-900">Secure escrow payment</p>
                            <p className="text-sm text-slate-600">Funds are held in a secure vault until export readiness.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-slate-900">Buyer protection</p>
                            <p className="text-sm text-slate-600">Full refund guarantees if the vehicle is not as described.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-slate-900">Transparent transaction</p>
                            <p className="text-sm text-slate-600">Track every step from payment to port arrival.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-slate-900">International simple</p>
                            <p className="text-sm text-slate-600">We handle the USD conversion and wire complexity.</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-5 bg-emerald-600 text-white p-6 rounded-2xl shadow-lg shadow-emerald-900/10 border border-white/10">
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                          <Info className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-center sm:text-left flex-1">
                          <p className="text-emerald-100 text-xs font-bold uppercase tracking-[0.1em] mb-1">Our Flat Fee</p>
                          <p className="text-2xl md:text-3xl font-black">Only $350 per transaction</p>
                        </div>
                        <div className="sm:ml-auto bg-emerald-700/50 px-4 py-2 rounded-lg border border-emerald-500/30 hidden lg:block">
                          <p className="text-emerald-50/90 text-[13px] leading-tight max-w-[160px] font-medium">
                            Includes escrow, title verification, and export setup.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>

          {/* 3 Value Combo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-20 h-20 mb-6 bg-emerald-50 rounded-full flex items-center justify-center">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
                  <Lock className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Secure Payment</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Your funds are protected in escrow until the vehicle is confirmed and ready for export.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-20 h-20 mb-6 flex items-center justify-center">
                 {/* Styled Ship icon to match image look */}
                 <Ship className="w-16 h-16 text-[#2f4f4f]" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Export Logistics</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Coordinated handling of international shipping and customs.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[24px] p-8 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-20 h-20 mb-6 flex items-center justify-center">
                 <FileSearch className="w-16 h-16 text-[#0b2447]" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Verified Sellers</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Thoroughly vetted U.S. sellers and vehicles for peace of mind.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Bottom Banner */}
      <div 
        onClick={() => navigate('/complete-payment')}
        className="text-white py-12 px-4 shadow-inner relative overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 cursor-pointer group"
      >
        {/* Background image (more visible) */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2000')] bg-cover bg-center opacity-25 group-hover:scale-105 transition-transform duration-700" />
        {/* Contrast overlay to keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-900/55 to-emerald-950/85" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <p className="text-2xl md:text-4xl font-bold tracking-tight text-center flex flex-col md:flex-row items-center gap-3 group-hover:text-emerald-300 transition-colors">
            <span>Make the U.S. a better experience with</span>
            <span className="bg-white/10 px-4 py-1 rounded-lg backdrop-blur-sm flex items-center gap-2 border border-white/20">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              SecurePay
            </span>
          </p>
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-sm bg-emerald-950/50 px-6 py-2 rounded-full border border-emerald-800/50 group-hover:bg-emerald-800 transition-all">
            Get Started Now
            <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurePay;
