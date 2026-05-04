import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const PromoBanner = () => {
  return (
    <div className=" bg-background px-4">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="review-wrap grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Why Made in States Section */}
          <div className="section why space-y-6">
            <h6 className="text-[22px] font-bold text-gray-900">Why Made in US?</h6>

            <ul className="grid grid-cols-2 gap-x-6 gap-y-5 mt-2">
              <li className="text-left">
                <strong className="inline-block text-[20px] font-extrabold text-gray-900 leading-tight mb-1 border-b-2 border-yellow-400 pb-0.5">30K+</strong>
                <span className="block text-[13px] text-gray-600 mt-1">Vehicles delivered</span>
              </li>

              <li className="text-left">
                <strong className="inline-block text-[20px] font-extrabold text-gray-900 leading-tight mb-1 border-b-2 border-yellow-400 pb-0.5">$670M+</strong>
                <span className="block text-[13px] text-gray-600 mt-1">Transaction volume</span>
              </li>

              <li className="text-left">
                <strong className="inline-block text-[20px] font-extrabold text-gray-900 leading-tight mb-1 border-b-2 border-yellow-400 pb-0.5">99%+</strong>
                <span className="block text-[13px] text-gray-600 mt-1">Customer satisfaction</span>
              </li>

              <li className="text-left">
                <strong className="inline-block text-[20px] font-extrabold text-gray-900 leading-tight mb-1 border-b-2 border-yellow-400 pb-0.5">950K+</strong>
                <span className="block text-[13px] text-gray-600 mt-1">Registered members</span>
              </li>
            </ul>
          </div>

          {/* Customer Reviews Section */}
          <div className="section stories space-y-6">
            <h6 className="text-2xl font-bold text-gray-900">Our customers love us!</h6>

            <div className="review space-y-4">
              <span className="heading flex items-center gap-4">
                <span className="stars flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </span>
                <span className="user text-[15px] font-semibold text-gray-900">Geoff A</span>
                <span className="date text-[15px] text-gray-500">May 2024</span>
              </span>
              <span className="blurb block text-[15px] leading-relaxed text-gray-600">
                Great selling experience! It went smooth from start to finish. I would recommend highly!
              </span>
            </div>
          </div>

          {/* Email Signup Section */}
          <div className="section daily space-y-6">
            <h6 className="text-2xl font-bold text-gray-900">Get the Daily Email</h6>

            <form method="post" className="space-y-3" autoComplete="off" noValidate>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <fieldset className="form-group mb-0 style2 flex-1">
                  <input
                    type="email"
                    id="footer-email"
                    name="email"
                    placeholder="Email address"
                    className="w-full px-4 h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 text-[15px] placeholder:text-gray-500"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </fieldset>

                <Button
                  className="inline-flex items-center justify-center h-12 px-6 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 rounded-md text-[15px] font-medium"
                >
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;