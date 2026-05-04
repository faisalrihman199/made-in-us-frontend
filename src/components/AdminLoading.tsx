import React from "react";
import Header from "./Header";
import { Loader2 } from "lucide-react";

interface AdminLoadingProps {
  message?: string;
}

const AdminLoading: React.FC<AdminLoadingProps> = ({ message = "Loading secure request details..." }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="relative">
          {/* Decorative rings */}
          <div className="absolute inset-0 scale-[2] opacity-10 blur-xl">
             <div className="w-24 h-24 rounded-full border-[8px] border-emerald-600 animate-ping" />
          </div>
          
          <div className="relative bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center border border-emerald-50">
            <Loader2 className="w-12 h-12 text-[#1b2d1d] animate-spin mb-6" strokeWidth={2.5} />
            
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">One Moment</h3>
              <p className="text-slate-500 font-medium text-sm max-w-[200px]">
                {message}
              </p>
            </div>

            {/* Progress bar skeleton */}
            <div className="w-full h-1 bg-slate-100 rounded-full mt-8 overflow-hidden">
              <div className="w-full h-full bg-emerald-600 origin-left animate-loading-bar" />
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes loading-bar {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminLoading;
