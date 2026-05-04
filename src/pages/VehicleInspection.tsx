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
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
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
    if (!formData.email || !formData.vin || !formData.listingUrl || !paymentProof) {
      toast.error("Please fill in all required fields", {
        description: "Email, VIN, Listing Link, and Payment Proof are mandatory."
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

          {/* Payment Proof */}
          <section className="bg-[#fcfdfd] border border-[#f0f0f0] rounded-[20px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
              <FileText className="w-5 h-5 text-[#4a6458]" strokeWidth={2.5} />
              <h2 className="text-[17px] font-medium text-gray-800">Proof of Payment *</h2>
            </div>
            
            {paymentDetails && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bank Transfer Details</p>
                  <div className="text-[13px] space-y-1">
                    <p><span className="text-slate-400">Bank:</span> <span className="font-bold">{paymentDetails.bank.bankName}</span></p>
                    <p><span className="text-slate-400">Account:</span> <span className="font-bold">{paymentDetails.bank.accountName}</span></p>
                    <p><span className="text-slate-400">Number:</span> <span className="font-bold">{paymentDetails.bank.accountNumber}</span></p>
                    <p><span className="text-slate-400">Routing/SWIFT:</span> <span className="font-bold">{paymentDetails.bank.swiftCode || paymentDetails.bank.routingNumber}</span></p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">PayPal Payment</p>
                  <div className="text-[13px] space-y-1">
                    <p className="text-slate-400">Send fee to:</p>
                    <p className="font-bold text-blue-700">{paymentDetails.paypal.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="paymentProof" className="text-[13px] font-medium text-gray-600 ml-1">Upload Receipt / Screenshot *</Label>
              <Input 
                id="paymentProof"
                type="file"
                onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                className="h-14 bg-white border-gray-200 rounded-xl py-3 cursor-pointer"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <p className="text-[12px] text-gray-500 font-normal ml-1 pt-1">
                Please upload a screenshot or PDF of your $500 payment confirmation.
              </p>
            </div>
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
