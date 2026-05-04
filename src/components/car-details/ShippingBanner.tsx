import { Truck, Crown } from 'lucide-react';
import { useGlobalState } from "@/context/GlobalStateContext";
import { Link } from 'react-router-dom';

const ShippingBanner: React.FC = () => {
  const { openShippingModal } = useGlobalState();

  return (
    <>
      <section className="mb-8 font-sans">
        {/* Shipping Banner */}
        <div
          onClick={openShippingModal}
          className="p-7 bg-[#f8faf9] rounded-[20px] border border-[#e1ede6] shadow-sm cursor-pointer transition-all hover:bg-[#f0f5f2] group"
        >
          <div className="flex flex-col items-center sm:items-start gap-5">
            <div className="flex items-start gap-5 w-full">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-[60px] h-[60px] bg-[#2d8a55] rounded-[18px] flex items-center justify-center shadow-lg shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-300">
                  <Truck className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <h3 className="text-[23px] font-bold text-[#1c2b36] mb-3 leading-tight tracking-tight">
                  Global Shipping
                </h3>
                <div className="text-[#3c4a54] leading-[1.5] text-[16.5px] font-medium max-w-xl">
                  <p className="mb-2">
                    Get fast and transparent shipping quotes tailored for your vehicle.
                  </p>
                  <p>
                    From domestic transport to export documentation, we ensure a seamless shipping experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Separator Line */}
            <div className="w-full h-px bg-[#e1ede6] mt-1"></div>

            {/* Badge & Button Container */}
            <div className="w-full flex flex-col items-center space-y-4">
              {/* Priority Access Badge */}
              <Link
                to="/membership"
                className="flex items-center gap-2.5 text-[#1e5c3b] hover:scale-105 transition-transform font-bold text-[16px]"
                onClick={(e) => e.stopPropagation()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#2d8a55]">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" />
                </svg>
                Priority access with membership
              </Link>

              {/* CTA Button */}
              <button className="bg-[#107050] hover:bg-[#0c5940] text-white px-10 py-4 rounded-xl font-bold text-[17px] flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
                Get Shipping Quote
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShippingBanner;
