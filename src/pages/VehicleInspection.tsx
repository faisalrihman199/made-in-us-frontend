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
import { Search, User, Car, ChevronDown, Mail, FileText, CreditCard, Landmark, Check, ShieldCheck, Clock, HandCoins } from "lucide-react";
import { submitVehicleInspection, getPaymentDetails } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

const VehicleInspection = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer">("transfer");
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

    if (paymentMethod === "transfer" && !paymentProof) {
      toast.error("Payment proof required", {
        description: "Please upload a receipt for the bank transfer."
      });
      return;
    }

    if (paymentMethod === "card") {
      toast.info("Card Payment Integration", {
        description: "Stripe payment is coming soon. Please use Bank Transfer for now."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitVehicleInspection(formData, paymentProof);
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

      <main className="max-w-[800px] mx-auto px-4 pt-10 pb-20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-[#e9ecef] rounded-[14px] flex items-center justify-center flex-shrink-0">
            <Search className="w-6 h-6 text-[#4a5c54]" />
          </div>
          <h1 className="text-[22px] md:text-[26px] font-medium text-[#1b2533] tracking-tight">
            Schedule a Professional Vehicle Inspection
          </h1>
        </div>

        <p className="text-[15px] text-gray-600 mb-6 pl-1 max-w-[95%] leading-relaxed">
          Get your selected vehicle inspected for <span className="font-semibold text-gray-900">$500</span> and receive a detailed report of its condition.
        </p>

        <div className="w-full bg-[#1b2d1d] text-white py-2.5 rounded-lg text-center font-medium text-[15px] mb-8 shadow-sm">
          $500 Inspection Fee
        </div>

        <div className="space-y-6">
          {/* Seller Information */}
          <section className="bg-[#fcfdfd] border border-[#f0f0f0] rounded-[20px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
              <User className="w-5 h-5 text-[#4a6458]" strokeWidth={2.5} />
              <h2 className="text-[17px] font-medium text-gray-800">Seller Information *</h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Seller's Name *</Label>
                <Input 
                  name="sellerName"
                  value={formData.sellerName}
                  onChange={handleInputChange}
                  placeholder="Seller's Name" 
                  className="h-11 rounded-lg border-gray-200" 
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Listing Link *</Label>
                <Input 
                  name="listingUrl"
                  value={formData.listingUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.example.com/listing/123" 
                  className="h-11 rounded-lg border-gray-200" 
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Seller's Phone *</Label>
                <Input 
                  name="sellerPhone"
                  value={formData.sellerPhone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000" 
                  className="h-11 rounded-lg border-gray-200" 
                />
              </div>
            </div>
          </section>

          {/* Vehicle Information */}
          <section className="bg-[#fcfdfd] border border-[#f0f0f0] rounded-[20px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
              <Car className="w-5 h-5 text-[#4a6458]" strokeWidth={2.5} />
              <h2 className="text-[17px] font-medium text-gray-800">Vehicle Information *</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Serial Number (VIN) *</Label>
                <Input 
                  name="vin"
                  value={formData.vin}
                  onChange={handleInputChange}
                  placeholder="VIN Number" 
                  className="h-11 rounded-lg border-gray-200" 
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Make / Model *</Label>
                <Input 
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  placeholder="e.g. Toyota Camry" 
                  className="h-11 rounded-lg border-gray-200" 
                />
              </div>
            </div>
          </section>

          {/* Your Information */}
          <section className="bg-[#fcfdfd] border border-[#f0f0f0] rounded-[20px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
              <User className="w-5 h-5 text-[#4a6458]" strokeWidth={2.5} />
              <h2 className="text-[17px] font-medium text-gray-800">Your Information *</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">First Name *</Label>
                <Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="h-11 rounded-lg border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Last Name *</Label>
                <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="h-11 rounded-lg border-gray-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="h-11 pl-10 rounded-lg border-gray-200" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Phone Number *</Label>
                <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" className="h-11 rounded-lg border-gray-200" />
              </div>
            </div>

            <div className="space-y-1.5 mb-5">
              <Label className="text-[13px] font-medium text-gray-600 ml-1">Street Address *</Label>
              <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="Street Address" className="h-11 rounded-lg border-gray-200" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] font-medium text-gray-600 ml-1">Country *</Label>
              <Select value={formData.country} onValueChange={handleSelectChange}>
                <SelectTrigger className="h-11 rounded-lg border-gray-200">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* New Inspection Payment Design */}
          <div className="bg-[#fcfdfd] border border-[#f0f0f0] rounded-[24px] p-8 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#2f884d] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#2f884d]/20">
                  <HandCoins className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1b2533]">Inspection Payment</h2>
                  <p className="text-gray-500 text-sm">Choose your payment method to complete your inspection request of $500.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-50 rounded-2xl border border-gray-100">
                <ShieldCheck className="w-6 h-6 text-[#2f884d]" />
                <div>
                  <p className="text-[13px] font-bold text-gray-800">Secure Payment</p>
                  <p className="text-[11px] text-gray-500">Your data is encrypted and protected.</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#1b2533] mb-6">Choose your payment method</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-4 relative ${
                  paymentMethod === "card"
                    ? "border-[#2f884d] bg-[#f0f9f3]/50"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "card" ? "border-[#2f884d]" : "border-gray-200"
                  }`}>
                    {paymentMethod === "card" && <div className="w-3 h-3 rounded-full bg-[#2f884d]" />}
                  </div>
                  <CreditCard className={`w-8 h-8 ${paymentMethod === "card" ? "text-[#2f884d]" : "text-gray-300"}`} />
                </div>
                <div>
                  <p className="font-bold text-[#1b2533] text-base mb-1">Credit / Debit Card (Stripe)</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed mb-4">Secure payment by credit or debit card via Stripe.</p>
                  <div className="flex gap-2">
                    <div className="h-6 w-10 bg-white border border-gray-100 rounded flex items-center justify-center shadow-sm">
                      <span className="text-[9px] font-black italic text-blue-800 tracking-tighter">VISA</span>
                    </div>
                    <div className="h-6 w-10 bg-white border border-gray-100 rounded flex items-center justify-center shadow-sm">
                      <div className="flex -space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-90" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-90" />
                      </div>
                    </div>
                    <div className="h-6 w-10 bg-white border border-gray-100 rounded flex items-center justify-center shadow-sm">
                      <div className="bg-[#0070d1] text-white text-[7px] font-bold px-1 rounded-sm">AMEX</div>
                    </div>
                    <div className="h-6 w-10 bg-black rounded flex items-center justify-center shadow-sm">
                      <div className="flex items-center gap-0.5">
                        <div className="w-2 h-2.5 bg-white" style={{ clipPath: "path('M4.42 1.63a1.44 1.44 0 0 0-.32.96 1.34 1.34 0 0 0 .34.92 1.25 1.25 0 0 0 .91-.45 1.5 1.5 0 0 0 .33-.94 1.15 1.15 0 0 0-.32-.93 1.4 1.4 0 0 0-.94-.44 1.3 1.3 0 0 0-.00 1.88zM4.14 3.7c-.52 0-.97.32-1.22.32-.26 0-.64-.28-1.04-.28a1.53 1.53 0 0 0-1.29.78 3.1 3.1 0 0 0-.4 1.56c0 .87.33 1.67.66 2.14.23.33.5.7.86.7.35 0 .48-.22.9-.22s.54.22.91.22c.36 0 .6-.33.83-.67a2.8 2.8 0 0 0 .38-.78 1.46 1.46 0 0 1-.87-1.33c0-1 .82-1.48 1.08-1.63a1.53 1.53 0 0 0-1.2-0.62')" }} />
                        <span className="text-white text-[9px] font-bold">Pay</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("transfer")}
                className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-4 relative ${
                  paymentMethod === "transfer"
                    ? "border-[#2f884d] bg-[#f0f9f3]/50"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "transfer" ? "border-[#2f884d]" : "border-gray-200"
                  }`}>
                    {paymentMethod === "transfer" && <div className="w-3 h-3 rounded-full bg-[#2f884d]" />}
                  </div>
                  <Landmark className={`w-8 h-8 ${paymentMethod === "transfer" ? "text-[#2f884d]" : "text-gray-300"}`} />
                </div>
                <div>
                  <p className="font-bold text-[#1b2533] text-base mb-1">Bank Transfer</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">Make a bank transfer directly from your bank account.</p>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Payment Details */}
              <div className="lg:col-span-2 space-y-6">
                {paymentMethod === "card" ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-[#1b2533]">Pay with credit or debit card</h4>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium ml-auto">
                        <ShieldCheck className="w-3 h-3" /> Secured by Stripe
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-bold text-gray-700">Card information</Label>
                        <div className="relative">
                          <Input placeholder="Card number" className="h-12 pr-24 rounded-xl border-gray-200" />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5 opacity-60">
                            <div className="h-5 w-8 bg-gray-50 rounded border border-gray-100 text-[8px] font-black flex items-center justify-center">VISA</div>
                            <div className="h-5 w-8 bg-gray-50 rounded border border-gray-100 text-[8px] font-black flex items-center justify-center">MC</div>
                            <div className="h-5 w-8 bg-gray-50 rounded border border-gray-100 text-[8px] font-black flex items-center justify-center">AMEX</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-[13px] font-bold text-gray-700">Expiration date</Label>
                          <Input placeholder="MM / YY" className="h-12 rounded-xl border-gray-200" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[13px] font-bold text-gray-700">CVC</Label>
                          <div className="relative">
                            <Input placeholder="CVC" className="h-12 rounded-xl border-gray-200" />
                            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-bold text-gray-700">Name on card</Label>
                        <Input placeholder="Full name" className="h-12 rounded-xl border-gray-200" />
                      </div>

                      <Button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full h-14 bg-[#1b2d1d] hover:bg-[#1b2d1d]/90 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                      >
                        {isSubmitting ? "Processing..." : (
                          <>
                            <ShieldCheck className="w-5 h-5" /> Pay $500
                          </>
                        )}
                      </Button>
                      
                      <p className="text-center text-[12px] text-gray-500 font-medium">
                        <ShieldCheck className="w-3 h-3 inline mr-1 text-[#2f884d]" /> Your payment is 100% secure. No card information is stored.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    <h4 className="font-bold text-[#1b2533] mb-4">Transfer details</h4>
                    {paymentDetails && (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-6 bg-[#f8f9fc] rounded-2xl border border-gray-100 space-y-4">
                          <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                            <span className="text-sm text-gray-500 font-medium">Bank Name</span>
                            <span className="font-bold text-gray-900">{paymentDetails.bank.bankName}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                            <span className="text-sm text-gray-500 font-medium">Account Name</span>
                            <span className="font-bold text-gray-900">{paymentDetails.bank.accountName}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                            <span className="text-sm text-gray-500 font-medium">Account Number</span>
                            <span className="font-bold text-gray-900">{paymentDetails.bank.accountNumber}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 font-medium">SWIFT / Routing</span>
                            <span className="font-bold text-gray-900">{paymentDetails.bank.swiftCode || paymentDetails.bank.routingNumber}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label className="text-[13px] font-bold text-gray-700">Upload Transfer Proof</Label>
                      <div className="relative group">
                        <Input 
                          type="file"
                          onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                          className="h-16 bg-white border-gray-200 rounded-2xl py-4 pl-12 cursor-pointer hover:border-[#2f884d] transition-all"
                        />
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[#2f884d]" />
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">Please upload a screenshot of your bank transfer.</p>
                    </div>

                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full h-14 bg-[#2f884d] hover:bg-[#25733f] text-white rounded-xl font-bold text-lg"
                    >
                      {isSubmitting ? "Scheduling..." : "Submit Inspection Request"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Right Column: Sidebar */}
              <div className="space-y-4">
                <div className="bg-[#f8f9fc] rounded-2xl p-6 border border-gray-100">
                  <h4 className="font-bold text-[#1b2533] mb-6">Order Summary</h4>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Vehicle inspection</span>
                      <span className="font-bold text-gray-900">$500.00</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-bold text-[#1b2533]">Total</span>
                    <span className="text-2xl font-black text-[#2f884d]">$500.00</span>
                  </div>
                </div>

                <div className="bg-[#f0f9f3]/50 rounded-2xl p-6 border border-[#2f884d]/10 space-y-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5 text-[#2f884d]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1b2533] text-sm mb-2">Estimated delivery time</h4>
                    <p className="text-[12px] text-gray-600 leading-relaxed mb-4">
                      You will receive the complete inspection report and vehicle photos within 3 to 5 business days, depending on the inspector's availability.
                    </p>
                    <div className="flex items-center gap-2 text-[12px] font-bold text-[#2f884d]">
                      <FileText className="w-4 h-4" /> Estimated time: 3 to 5 days
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Receive Section */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2f884d] rounded-full flex items-center justify-center text-white">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-[#1b2533]">What you receive</h4>
                  </div>
                  <p className="text-[13px] text-gray-600 leading-relaxed max-w-[400px]">
                    A detailed inspection report including the vehicle condition, HD photos, and all important information for your purchase.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm rotate-[-2deg] transition-transform hover:rotate-0">
                    <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400" alt="Car" className="w-full h-full object-cover grayscale-[0.2]" />
                  </div>
                  <div className="w-24 h-32 bg-white rounded-lg p-2 border border-gray-200 shadow-sm flex flex-col gap-1 transition-transform hover:translate-y-[-4px]">
                    <div className="h-2 w-3/4 bg-gray-300 rounded mb-1" />
                    <div className="space-y-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-sm bg-[#2f884d]/40" />
                          <div className={`h-1 bg-gray-100 rounded ${i % 2 === 0 ? "w-full" : "w-2/3"}`} />
                        </div>
                      ))}
                    </div>
                    <div className="h-1.5 w-1/2 bg-gray-200 rounded mt-2" />
                    <div className="space-y-1">
                      <div className="h-0.5 w-full bg-gray-100 rounded" />
                      <div className="h-0.5 w-full bg-gray-100 rounded" />
                      <div className="h-0.5 w-3/4 bg-gray-100 rounded" />
                    </div>
                    <div className="mt-auto h-8 w-full bg-[#f0f9f3] rounded-md flex flex-col items-center justify-center gap-0.5 border border-[#2f884d]/10">
                      <div className="w-2.5 h-2.5 bg-[#2f884d] rounded-full flex items-center justify-center">
                        <Check className="w-1.5 h-1.5 text-white" />
                      </div>
                      <div className="h-0.5 w-8 bg-[#2f884d]/20 rounded" />
                    </div>
                  </div>
                  <div className="w-24 h-32 bg-white rounded-lg p-2 border border-gray-200 shadow-sm flex flex-col gap-1 translate-y-1 rotate-[2deg] transition-transform hover:rotate-0">
                    <div className="h-2 w-2/3 bg-gray-300 rounded mb-1" />
                    <div className="space-y-1">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className={`h-1 bg-gray-100 rounded ${i % 3 === 0 ? "w-full" : "w-4/5"}`} />
                      ))}
                    </div>
                    <div className="mt-2 h-2 w-3/4 bg-gray-200 rounded" />
                    <div className="space-y-1">
                      <div className="h-0.5 w-full bg-gray-100 rounded" />
                      <div className="h-0.5 w-5/6 bg-gray-100 rounded" />
                      <div className="h-0.5 w-full bg-gray-100 rounded" />
                      <div className="h-0.5 w-2/3 bg-gray-100 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center pt-6">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-[320px] max-w-full h-12 bg-[#1b2d1d] hover:bg-[#3d5449] text-white rounded-[10px] font-medium text-[16px] transition-all active:scale-[0.98] mb-4"
            >
              {isSubmitting ? "Scheduling..." : "Schedule Inspection — $500"}
            </Button>

            <p className="text-center text-[#6e7b75] text-[13px] font-normal max-w-[420px] leading-relaxed">
              You will receive a detailed inspection report and photos of the vehicle within 24 hours of scheduling.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VehicleInspection;
