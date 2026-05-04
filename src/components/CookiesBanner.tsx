import React, { useState, useEffect } from 'react';
import { Cookie, X, Check, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface CookiesBannerProps {
  forceShow?: boolean;
  onClose?: () => void;
}

const CookiesBanner: React.FC<CookiesBannerProps> = ({ forceShow = false, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookies-consent');
    if (!consent || forceShow) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  const handleAccept = () => {
    localStorage.setItem('cookies-consent', 'accepted');
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleDecline = () => {
    localStorage.setItem('cookies-consent', 'declined');
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom-10 fade-in duration-500 max-w-[420px] w-[calc(100%-48px)]">
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden group">
        {/* Subtle Background Pattern */}
        {/* <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700" />

        <button
          onClick={() => { setIsVisible(false); if (onClose) onClose(); }}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-all z-10"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button> */}

        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
            <Cookie className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1b2533]">Cookie Preferences</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Privacy Controls</p>
          </div>
        </div>

        <p className="text-gray-500 text-[14px] leading-relaxed mb-6 relative z-10">
          We use cookies to enhance your browsing experience and analyze our traffic.
          <Link
            to="/cookies"
            className="text-emerald-600 font-bold hover:underline ml-1 inline-flex items-center gap-0.5"
            onClick={() => { setIsVisible(false); if (onClose) onClose(); }}
          >
            Privacy Policy <ArrowRight className="w-3 h-3" />
          </Link>
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
          <Button
            onClick={handleAccept}
            className="w-full h-11 bg-[#1b2533] hover:bg-black text-white font-bold rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Accept All
          </Button>
          <Link
            to="/cookies"
            className="w-full"
            onClick={() => { setIsVisible(false); if (onClose) onClose(); }}
          >
            <Button
              variant="ghost"
              className="w-full h-11 text-gray-500 hover:text-[#1b2533] font-bold hover:bg-gray-50 rounded-2xl transition-all"
            >
              Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CookiesBanner;
