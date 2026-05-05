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
import { Lock, Car, FileText, Mail, Phone, User } from "lucide-react";
import { submitVehicleReservation, getPaymentDetails } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { countryCodes } from "@/lib/countries";

const ReserveVehicle = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    getPaymentDetails().then(setPaymentDetails).catch(console.error);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phonePrefix: "+1",
    phone: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    budget: "",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.vehicleMake || !formData.vehicleModel || !paymentProof) {
      toast.error("Required fields missing", {
        description: "Please provide your email, vehicle details, and proof of deposit."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSend = {
        ...formData,
        phone: `${formData.phonePrefix}${formData.phone}`
      };
      // @ts-ignore
      await submitVehicleReservation(dataToSend, paymentProof!);
      navigate("/confirmation");
    } catch (error) {
      toast.error("Failed to submit reservation", {
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
          <div className="w-12 h-12 bg-[#e9ecef] rounded-[14px] flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
            <Lock className="w-6 h-6 text-[#294c39]" strokeWidth={2.5} />
          </div>
          <h1 className="text-[22px] md:text-[26px] font-medium text-[#1b2533] tracking-tight">
            Secure Your Vehicle with a Deposit
          </h1>
        </div>

        <p className="text-[15px] text-gray-600 mb-8 pl-1 max-w-[95%] leading-relaxed">
          Reserve your selected vehicle with a <span className="font-semibold text-gray-900">$1,000 refundable deposit</span>. Upload your payment proof below to proceed.
        </p>

        <div className="space-y-6">
          {/* Your Information */}
          <section className="bg-[#fcfdfd] border border-[#f0f0f0] rounded-[20px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
              <User className="w-5 h-5 text-[#4a6458]" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="h-11 pl-10 rounded-lg border-gray-200" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Phone Number *</Label>
                <div className="flex gap-2">
                  <Select value={formData.phonePrefix} onValueChange={(val) => setFormData(prev => ({ ...prev, phonePrefix: val }))}>
                    <SelectTrigger className="w-[100px] h-11 rounded-lg border-gray-200">
                      <SelectValue placeholder="+1" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((c) => (
                        <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 000-0000" 
                    className="flex-1 h-11 rounded-lg border-gray-200" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Vehicle Information */}
          <section className="bg-[#fcfdfd] border border-[#f0f0f0] rounded-[20px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
              <Car className="w-5 h-5 text-[#4a6458]" strokeWidth={2.5} />
              <h2 className="text-[17px] font-medium text-gray-800">Desired Vehicle *</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Make *</Label>
                <Input name="vehicleMake" value={formData.vehicleMake} onChange={handleInputChange} placeholder="e.g. Toyota" className="h-11 rounded-lg border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Model *</Label>
                <Input name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} placeholder="e.g. Camry" className="h-11 rounded-lg border-gray-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Year (Optional)</Label>
                <Input name="vehicleYear" value={formData.vehicleYear} onChange={handleInputChange} placeholder="e.g. 2022" className="h-11 rounded-lg border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Budget (Optional)</Label>
                <Input name="budget" value={formData.budget} onChange={handleInputChange} placeholder="e.g. $25,000" className="h-11 rounded-lg border-gray-200" />
              </div>
            </div>
          </section>

          {/* Payment Proof */}
          <section className="bg-[#fcfdfd] border border-[#f0f0f0] rounded-[20px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
              <FileText className="w-5 h-5 text-[#4a6458]" strokeWidth={2.5} />
              <h2 className="text-[17px] font-medium text-gray-800">Proof of Deposit ($1,000) *</h2>
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
                    <p className="text-slate-400">Send deposit to:</p>
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
                Please upload a screenshot or PDF of your $1,000 refundable deposit.
              </p>
            </div>
          </section>

          <div className="flex flex-col items-center pt-6">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-[340px] max-w-full h-12 bg-[#1b2d1d] hover:bg-[#3d5449] text-white rounded-[10px] font-medium text-[16px] transition-all active:scale-[0.98] mb-4 shadow-lg shadow-[#1b2d1d]/10"
            >
              {isSubmitting ? "Submitting Request..." : "Submit $1,000 Deposit"}
            </Button>
            
            <p className="text-center text-[#6e7b75] text-[13px] font-normal max-w-[420px] leading-relaxed">
              Your deposit is credited toward your final vehicle purchase and is 100% secure.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReserveVehicle;
