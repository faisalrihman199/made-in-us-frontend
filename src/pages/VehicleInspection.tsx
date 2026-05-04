import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, User, Car, ChevronDown, Mail, FileText } from "lucide-react";
import { submitVehicleInspection, getPaymentDetails } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

const VehicleInspection = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "bank">("stripe");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    getPaymentDetails().then(setPaymentDetails).catch(console.error);
  }, []);

  const [formData, setFormData] = useState({
    sellerName: "",
    listingUrl: "",
    sellerPhone: "",
    vin: "",
    make: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    country: "United States",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, country: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.email || !formData.vin || !formData.listingUrl) {
      toast.error("Please fill in all required fields", {
        description: "Email, VIN, and Listing Link are mandatory."
      });
      return;
    }

    if (paymentMethod === "bank" && !paymentProof) {
      toast.error("Proof of payment required", {
        description: "Please upload a screenshot of your bank transfer."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitVehicleInspection(formData, paymentProof || undefined);
      navigate("/confirmation");
    } catch (error) {
      toast.error("Failed to schedule inspection", {
        description: "Please try again later or contact support."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />

        <div className="flex items-center justify-between bg-white border border-[#f0f0f0] rounded-[20px] p-6 shadow-sm mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#e9ecef] rounded-[14px] flex items-center justify-center flex-shrink-0">
              <Search className="w-6 h-6 text-[#4a5c54]" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-[#1b2533] tracking-tight">
                Inspection Payment
              </h1>
              <p className="text-[14px] text-gray-500">
                Choose your payment method to complete your inspection request of $500.
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-full border-2 border-[#60E677]/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#60E677]/10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2f884d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#1b2533]">Secure Payment</p>
              <p className="text-[11px] text-gray-400">Your data is encrypted and protected.</p>
            </div>
          </div>
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method Selection */}
              <section className="bg-white border border-[#f0f0f0] rounded-[24px] p-8 shadow-sm">
                <h2 className="text-[18px] font-bold text-[#1b2533] mb-6">Choose your payment method</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod("stripe")}
                    className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                      paymentMethod === "stripe" 
                        ? "border-[#2f884d] bg-[#f8fff9]" 
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "stripe" ? "border-[#2f884d]" : "border-gray-300"
                      }`}>
                        {paymentMethod === "stripe" && <div className="w-3 h-3 rounded-full bg-[#2f884d]" />}
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                      </div>
                    </div>
                    <h3 className="font-bold text-[#1b2533] text-[16px] mb-1">Credit / Debit Card (Stripe)</h3>
                    <p className="text-[13px] text-gray-500 mb-4">Secure payment by credit or debit card via Stripe.</p>
                    <div className="flex gap-2">
                      <div className="px-2 py-1 bg-white border border-gray-100 rounded text-[10px] font-black italic text-[#1A1F71]">VISA</div>
                      <div className="px-2 py-1 bg-white border border-gray-100 rounded text-[10px] font-black italic text-[#EB001B]">MC</div>
                      <div className="px-2 py-1 bg-white border border-gray-100 rounded text-[10px] font-black italic text-[#0070D1]">AMEX</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("bank")}
                    className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                      paymentMethod === "bank" 
                        ? "border-[#2f884d] bg-[#f8fff9]" 
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "bank" ? "border-[#2f884d]" : "border-gray-300"
                      }`}>
                        {paymentMethod === "bank" && <div className="w-3 h-3 rounded-full bg-[#2f884d]" />}
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M2 10l10-7 10 7" /></svg>
                      </div>
                    </div>
                    <h3 className="font-bold text-[#1b2533] text-[16px] mb-1">Bank Transfer</h3>
                    <p className="text-[13px] text-gray-500">Make a bank transfer directly from your bank account.</p>
                  </button>
                </div>
              </section>

              {paymentMethod === "stripe" ? (
                <section className="bg-white border border-[#f0f0f0] rounded-[24px] p-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[18px] font-bold text-[#1b2533]">Pay with credit or debit card</h2>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                      <span className="text-[12px] font-semibold">Secured by Stripe</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold text-gray-700">Card information</Label>
                      <div className="relative">
                        <Input placeholder="Card number" className="h-12 pr-24 rounded-xl border-gray-200" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5 grayscale opacity-60">
                          <div className="w-8 h-5 bg-gray-100 rounded" />
                          <div className="w-8 h-5 bg-gray-100 rounded" />
                          <div className="w-8 h-5 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[13px] font-bold text-gray-700">Expiration date</Label>
                        <Input placeholder="MM / YY" className="h-12 rounded-xl border-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[13px] font-bold text-gray-700">CVC</Label>
                        <div className="relative">
                          <Input placeholder="CVC" className="h-12 rounded-xl border-gray-200" />
                          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold text-gray-700">Name on card</Label>
                      <Input placeholder="Full name" className="h-12 rounded-xl border-gray-200" />
                    </div>

                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full h-14 bg-[#1b2d1d] hover:bg-[#253d28] text-white rounded-xl font-bold text-[18px] transition-all flex items-center justify-center gap-2 mt-4"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                      Pay $500
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                      </div>
                      <p className="text-[11px] font-medium">Your payment is 100% secure. No card information is stored.</p>
                    </div>
                  </div>
                </section>
              ) : (
                <section className="bg-white border border-[#f0f0f0] rounded-[24px] p-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                  <h2 className="text-[18px] font-bold text-[#1b2533] mb-6">Bank Transfer Details</h2>
                  {paymentDetails && (
                    <div className="p-6 bg-[#f8f9fc] rounded-2xl border border-gray-100 space-y-4 mb-6">
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase">Bank Name</p>
                          <p className="text-[15px] font-bold text-[#1b2533]">{paymentDetails.bank.bankName}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase">Account Name</p>
                          <p className="text-[15px] font-bold text-[#1b2533]">{paymentDetails.bank.accountName}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase">Account Number</p>
                          <p className="text-[15px] font-bold text-[#1b2533]">{paymentDetails.bank.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-400 uppercase">Routing / SWIFT</p>
                          <p className="text-[15px] font-bold text-[#1b2533]">{paymentDetails.bank.swiftCode || paymentDetails.bank.routingNumber}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="paymentProof" className="text-[13px] font-bold text-gray-700 ml-1">Upload Receipt / Screenshot *</Label>
                      <Input 
                        id="paymentProof"
                        type="file"
                        onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                        className="h-14 bg-white border-gray-200 rounded-xl py-3 cursor-pointer"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <p className="text-[12px] text-gray-500 font-normal ml-1">
                        Please upload a screenshot of your $500 bank transfer confirmation.
                      </p>
                    </div>

                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting || !paymentProof}
                      className="w-full h-14 bg-[#1b2d1d] hover:bg-[#253d28] text-white rounded-xl font-bold text-[18px] transition-all"
                    >
                      {isSubmitting ? "Scheduling..." : "Submit Inspection Request"}
                    </Button>
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-[#f8fff9] border border-[#60E677]/20 rounded-[24px] p-6">
                <h3 className="text-[16px] font-bold text-[#1b2533] mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-gray-500 font-medium">Vehicle inspection</span>
                    <span className="text-[#1b2533] font-bold">$500.00</span>
                  </div>
                  <div className="pt-3 border-t border-[#60E677]/10 flex justify-between items-center">
                    <span className="text-[16px] font-bold text-[#1b2533]">Total</span>
                    <span className="text-[20px] font-black text-[#2f884d]">$500.00</span>
                  </div>
                </div>
              </div>

              {/* Delivery Time */}
              <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  </div>
                  <h3 className="text-[15px] font-bold text-[#1b2533]">Estimated delivery time</h3>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                  You will receive the complete inspection report and vehicle photos within 3 to 5 business days, depending on the inspector's availability.
                </p>
                <div className="flex items-center gap-2 text-[#2f884d] bg-[#f8fff9] px-3 py-2 rounded-lg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  <span className="text-[12px] font-bold">Estimated time: 3 to 5 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* What you receive */}
          <section className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm mt-8">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#f8fff9] rounded-2xl border border-[#60E677]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-[#2f884d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#1b2533] mb-1">What you receive</h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed max-w-md">
                    A detailed inspection report including the vehicle condition, HD photos, and all important information for your purchase.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 grayscale opacity-40">
                <div className="w-24 h-32 bg-gray-100 rounded-lg" />
                <div className="w-24 h-32 bg-gray-100 rounded-lg" />
              </div>
            </div>
          </section>
      </main>

      <Footer />
    </div>
  );
};

export default VehicleInspection;
