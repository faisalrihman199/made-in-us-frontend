import React from 'react';
import { useNavigate } from 'react-router-dom';

const SafePay: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="mb-8">
      {/* Disclaimer Notice */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <p className="text-sm text-gray-700">
          All MADE-IN-US vehicle listings are written based on detailed information provided during the submission process.
          However, it is ultimately the <span className="font-semibold">buyer's responsibility</span> to perform all due diligence <span className="font-semibold">prior to purchase</span>,
          including but not limited to factual content, flaws, legality of registering in any given state, emissions/safety compliance, and import eligibility.
        </p>
      </div>

      {/* SafePay Section */}
      <div
        onClick={() => navigate('/secure-pay')}
        className="p-7 bg-[#f8faf9] rounded-[20px] border border-[#e1ede6] shadow-sm cursor-pointer transition-all hover:bg-[#f0f5f2] group"
      >
        <div className="flex flex-col items-center sm:items-start gap-5">
          <div className="flex items-start gap-5 w-full">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-[60px] h-[60px] bg-[#2d8a55] rounded-[18px] flex items-center justify-center shadow-lg shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <h3 className="text-[23px] font-bold text-[#1c2b36] mb-3 leading-tight tracking-tight">
                SecurePay
              </h3>
              <div className="text-[#3c4a54] leading-[1.5] text-[16.5px] font-medium max-w-xl">
                <p className="mb-2">
                  Experience secure transactions with Made-in-US SecurePay, our trusted escrow payment service for international vehicle buyers.
                </p>
                <p>
                  The safest way to purchase vehicles from the United States.
                </p>
              </div>
            </div>
          </div>

          {/* Separator Line */}
          <div className="w-full h-px bg-[#e1ede6] mt-2"></div>

          {/* Badge Indicator - Centered */}
          <div className="w-full flex justify-center py-1">
            <div className="inline-flex items-center gap-2.5 text-[#1e5c3b] font-bold text-[16px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#2d8a55]">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Trusted & Protected Payment
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafePay;