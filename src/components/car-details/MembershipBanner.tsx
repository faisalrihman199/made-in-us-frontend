import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Crown } from 'lucide-react';

const MembershipBanner: React.FC = () => {
  return (
    <div className="bg-[#f8faf9] border border-[#e1ede6] rounded-[20px] p-8 mt-8 shadow-sm font-sans">
      {/* Top Section - Left Aligned */}
      <div className="flex flex-col items-start text-left">
        {/* Title Section with Inline Icon */}
        <div className="flex items-center gap-2 mb-4 text-[#1c2b36]">
          <ShieldCheck className="w-12 h-12 text-[#2d8a55]" strokeWidth={2.5} />
          <h3 className="text-[23px] font-bold tracking-tight">Membership Plans</h3>
        </div>

        {/* Description */}
        <div className="text-[#3c4a54] leading-[1.6] text-[16.5px] font-medium max-w-2xl mb-6">
          <p>
            Unlock premium access to top US vehicles and expert export services.
          </p>
          <p>
            Enjoy exclusive inventory, dedicated support, and full export solutions.
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-[#e1ede6] mb-6"></div>

      {/* Bottom Section - Centered */}
      <div className="flex flex-col items-center text-center">
        {/* Features Grid */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8">
          <div className="flex items-center gap-2 text-[15.5px] font-bold text-[#1e5c3b]">
            <CheckCircle2 className="w-[18px] h-[18px] text-[#2d8a55]" />
            No hidden fees
          </div>
          <div className="flex items-center gap-2 text-[15.5px] font-bold text-[#1e5c3b]">
            <CheckCircle2 className="w-[18px] h-[18px] text-[#2d8a55]" />
            Dedicated support
          </div>
          <div className="flex items-center gap-2 text-[15.5px] font-bold text-[#1e5c3b]">
            <CheckCircle2 className="w-[18px] h-[18px] text-[#2d8a55]" />
            Complete export quotes
          </div>
        </div>

        {/* CTA Button */}
        <Link to="/membership" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto bg-[#107050] hover:bg-[#0c5940] text-white px-12 py-4 rounded-xl font-bold text-[17px] flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
            View Pricing Plans
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MembershipBanner;
