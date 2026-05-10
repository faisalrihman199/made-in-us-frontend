import React from "react";
import { useNavigate } from "react-router-dom";

// SVG Icons matching the image
const CarIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <path d="M8 36l6-14h36l6 14" stroke="#2f884d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="6" y="36" width="52" height="14" rx="3" stroke="#2f884d" strokeWidth="2.5" />
    <circle cx="18" cy="50" r="4" stroke="#2f884d" strokeWidth="2.5" />
    <circle cx="46" cy="50" r="4" stroke="#2f884d" strokeWidth="2.5" />
    <path d="M14 36V30" stroke="#2f884d" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 36V30" stroke="#2f884d" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const HandshakeIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <path d="M4 28l10 10 8-4 10 6 10-6 8 4 10-10" stroke="#2f884d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 38l6 8" stroke="#2f884d" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M50 38l-6 8" stroke="#2f884d" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M22 42l10 6 10-6" stroke="#2f884d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 34l6-8h8l6 8" stroke="#2f884d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClipboardIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <rect x="14" y="12" width="36" height="44" rx="3" stroke="#2f884d" strokeWidth="2.5" />
    <path d="M24 12V8h16v4" stroke="#2f884d" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M22 30l6 6 14-14" stroke="#2f884d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <circle cx="32" cy="32" r="22" stroke="#2f884d" strokeWidth="2.5" />
    <ellipse cx="32" cy="32" rx="10" ry="22" stroke="#2f884d" strokeWidth="2.5" />
    <path d="M10 32h44M12 20h40M12 44h40" stroke="#2f884d" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <rect x="8" y="10" width="48" height="34" rx="6" fill="#2f884d" />
    <path d="M20 44l-8 10 10-6" fill="#2f884d" />
    <path d="M20 27h24M20 33h16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#2f884d" />
    <circle cx="12" cy="9" r="2.5" fill="white" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#2f884d" strokeWidth="1.8" />
    <path d="M2 8l10 7 10-7" stroke="#2f884d" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const WebIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <circle cx="12" cy="12" r="9" stroke="#2f884d" strokeWidth="1.8" />
    <ellipse cx="12" cy="12" rx="4" ry="9" stroke="#2f884d" strokeWidth="1.8" />
    <path d="M3 12h18M4 7h16M4 17h16" stroke="#2f884d" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" stroke="#2f884d" strokeWidth="2" />
    <path d="M7 12l3.5 3.5L17 8" stroke="#2f884d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Logo SVG
const Logo = ({ dark = false }) => (
  <div className="flex flex-col items-start">
    <div className={`text-xl font-black tracking-tight ${dark ? "text-white" : "text-white"}`} style={{ fontFamily: "Arial Black, sans-serif", letterSpacing: "-0.5px" }}>
      MADE-IN-US<span className="text-[#2f884d]">.</span>COM
    </div>
    <div className={`text-[9px] tracking-widest font-medium mt-0.5 ${dark ? "text-gray-300" : "text-gray-300"}`}>
      AMERICA'S BEST VEHICLES, DELIVERED WORLDWIDE
    </div>
  </div>
);

const Confirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f7f9] font-sans" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="w-full mx-auto bg-white shadow-2xl min-h-screen flex flex-col">

        {/* ── HEADER ── */}
        <div className="relative h-[350px] md:h-[450px] overflow-hidden bg-[#1a1a1a]">
          {/* Background image - high quality sleek car */}
          <img
            src="https://images.unsplash.com/photo-1574023278981-0b48ba10e9ba?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhciUyMGRlYWxlcnNoaXB8ZW58MHx8MHx8fDA%3D"
            alt="Luxury Car Header"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />

          {/* Green top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2f884d] z-20" />

          {/* Content inside header */}
          <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12">
            <div className="flex justify-between items-start">
              <Logo />
              <div className="hidden md:block">
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-2 border border-white/30 text-white rounded-full hover:bg-white/10 transition-all text-sm font-bold uppercase tracking-wider"
                >
                  Visit Website
                </button>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-[3px] border-[#2f884d] bg-black/40 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                  <svg viewBox="0 0 48 48" className="w-10 h-10 md:w-14 md:h-14" fill="none">
                    <path d="M10 24l10 10 18-18" stroke="#2f884d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter" style={{ fontFamily: "Arial Black, sans-serif" }}>
                    THANK YOU FOR<br />YOUR REQUEST
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT WRAPPER ── */}
        <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 md:px-8 -mt-20 relative z-20 gap-8 pb-12">

          {/* Main Inquiry Status Card */}
          <div className="flex-[2] bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-[#1a2b3c] uppercase" style={{ fontFamily: "Arial Black, sans-serif" }}>
                Success! We've got your inquiry.
              </h2>

              <div className="h-1 w-20 bg-[#2f884d] rounded-full" />

              <p className="text-gray-700 text-lg leading-relaxed">
                Your request has been successfully transmitted to our team of automotive experts.
                We are now processing your details to provide you with the most accurate and
                competitive information.
              </p>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <p className="text-[#1a4d2e] text-lg font-bold flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#2f884d] animate-pulse" />
                  Expect a response usually within the same day.
                </p>
              </div>

              <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-[#2f884d] tracking-widest uppercase">Next Steps</h3>
                  <ul className="space-y-4">
                    {[
                      "Expert analysis of your request",
                      "Inventory check & market verification",
                      "Direct contact from your specialist",
                      "Finalized quote & logistics plan"
                    ].map((step, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-600 font-medium">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <CheckIcon />
                        </div>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-[#2f884d] tracking-widest uppercase">Contact Us Directly</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <EmailIcon />
                      <span className="text-gray-700 font-bold">contact@made-in-us.com</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <ChatIcon />
                      <span className="text-gray-700 font-bold">Live Support Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Services Card */}
          <div className="flex-1 space-y-6">
            <div className="bg-[#1a2b3c] rounded-3xl shadow-xl p-8 text-white">
              <h2 className="text-xl font-black uppercase mb-6" style={{ fontFamily: "Arial Black, sans-serif" }}>
                Why Choose Us?
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <CarIcon />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm mb-1 text-[#2f884d]">Massive Inventory</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">Direct access to 50,000+ verified vehicles across the United States.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <HandshakeIcon />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm mb-1 text-[#2f884d]">Expert Negotiation</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">Our pros negotiate with dealerships to get you the best possible price.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <GlobeIcon />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm mb-1 text-[#2f884d]">Global Logistics</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">Seamless worldwide shipping and door-to-door delivery services.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
              <button
                onClick={() => navigate("/")}
                className="w-full py-4 bg-[#2f884d] hover:bg-[#25733f] text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98]"
              >
                Back to Marketplace
              </button>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="bg-[#111] mt-auto">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
              <div className="flex flex-col">
                <img 
                  src="/confirm-footer-logo.png" 
                  alt="Made In US Logo" 
                  className="h-20 w-auto object-contain"
                />
                <p className="mt-6 text-gray-500 text-sm max-w-sm leading-relaxed">
                  The premier destination for sourcing high-quality American vehicles and delivering them
                  to clients worldwide with complete transparency and professional care.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                  <h5 className="text-[#2f884d] font-bold uppercase text-xs tracking-widest">Connect</h5>
                  <div className="space-y-2 text-gray-400 text-sm">
                    <p>contact@made-in-us.com</p>
                    <p>www.made-in-us.com</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-[#2f884d] font-bold uppercase text-xs tracking-widest">Headquarters</h5>
                  <div className="space-y-2 text-gray-400 text-sm">
                    <p>30 N Gould St Ste N</p>
                    <p>Sheridan, WY 82801</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-gray-600 text-[10px] tracking-[0.25em] uppercase">
                &copy; 2024 MADE-IN-US.COM. ALL RIGHTS RESERVED.
              </p>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Trusted Partner</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border border-gray-700 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#2f884d] rounded-full" />
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Secure Transaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Confirmation;