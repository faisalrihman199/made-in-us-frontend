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
import { Search, User, Car, ChevronDown, Mail, FileText, CreditCard, Landmark, Check } from "lucide-react";
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

          {/* Payment Method */}
          <section className="bg-[#fcfdfd] border border-[#f0f0f0] rounded-[20px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <CreditCard className="w-5 h-5 text-[#4a6458]" strokeWidth={2.5} />
              <h2 className="text-[17px] font-medium text-gray-800">Select Payment Method *</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${
                  paymentMethod === "card"
                    ? "border-[#2f884d] bg-[#f0f9f3]"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  paymentMethod === "card" ? "bg-[#2f884d] text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className={`font-bold text-[15px] mb-0.5 ${paymentMethod === "card" ? "text-[#1b2533]" : "text-gray-600"}`}>Credit Card</p>
                  <p className="text-[11px] text-gray-500 font-medium">Stripe Payment</p>
                </div>
                {paymentMethod === "card" && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4 text-[#2f884d]" />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("transfer")}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${
                  paymentMethod === "transfer"
                    ? "border-[#2f884d] bg-[#f0f9f3]"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  paymentMethod === "transfer" ? "bg-[#2f884d] text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  <Landmark className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className={`font-bold text-[15px] mb-0.5 ${paymentMethod === "transfer" ? "text-[#1b2533]" : "text-gray-600"}`}>Bank Transfer</p>
                  <p className="text-[11px] text-gray-500 font-medium">Traditional Wire</p>
                </div>
                {paymentMethod === "transfer" && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4 text-[#2f884d]" />
                  </div>
                )}
              </button>
            </div>
            
            {paymentMethod === "card" ? (
              <div className="p-10 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-gray-200" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">Stripe Integration Coming Soon</p>
                  <p className="text-gray-500 text-[13px] max-w-[280px] mx-auto leading-relaxed">
                    Card payments via Stripe are being finalized. Please select **Bank Transfer** to proceed with your inspection today.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                {paymentDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Bank Details</p>
                      <div className="text-[14px] space-y-2">
                        <div className="flex justify-between border-b border-gray-50 pb-1.5">
                          <span className="text-gray-400">Bank</span>
                          <span className="font-bold text-gray-800">{paymentDetails.bank.bankName}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-1.5">
                          <span className="text-gray-400">Account</span>
                          <span className="font-bold text-gray-800">{paymentDetails.bank.accountName}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-1.5">
                          <span className="text-gray-400">Account #</span>
                          <span className="font-bold text-gray-800">{paymentDetails.bank.accountNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">SWIFT</span>
                          <span className="font-bold text-gray-800">{paymentDetails.bank.swiftCode || paymentDetails.bank.routingNumber}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 bg-blue-50/30 rounded-2xl border border-blue-100/50 space-y-3">
                      <p className="text-[11px] font-black text-blue-500/70 uppercase tracking-widest">Alternative</p>
                      <div className="space-y-2">
                        <p className="text-[13px] text-gray-600 font-medium">Send $500 via PayPal to:</p>
                        <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                          <p className="font-black text-blue-700 text-[14px] truncate">{paymentDetails.paypal.email}</p>
                        </div>
                        <p className="text-[11px] text-blue-600/70 font-bold">* Reference: Vehicle VIN</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="paymentProof" className="text-[13px] font-bold text-gray-700 ml-1">Upload Payment Proof *</Label>
                  <div className="relative group">
                    <Input 
                      id="paymentProof"
                      type="file"
                      onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                      className="h-16 bg-white border-gray-200 rounded-2xl py-4 pl-12 cursor-pointer transition-all hover:border-[#2f884d] hover:bg-[#f0f9f3]/30"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[#2f884d] transition-colors" />
                  </div>
                  <p className="text-[12px] text-gray-500 font-medium ml-1 pt-1 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                    PDF, JPG, or PNG of your $500 transfer confirmation.
                  </p>
                </div>
              </div>
            )}
          </section>

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
