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
import { Lock, Car, User, Mail, Phone, Hash, Palette } from "lucide-react";
import { submitVehicleFindRequest } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { countryCodes } from "@/lib/countries";

const FindVehicle = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    make: "",
    year: "",
    mileage: "",
    color: "",
    listingUrl: "",
    name: "",
    email: "",
    phonePrefix: "+1",
    phone: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.make || !formData.year || !formData.name || !formData.email) {
      toast.error("Required fields missing", {
        description: "Please fill in all mandatory vehicle and contact details."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitVehicleFindRequest(formData);
      navigate("/confirmation");
    } catch (error) {
      toast.error("Failed to submit inquiry", {
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
            Found Your Vehicle? Send It to Us
          </h1>
        </div>

        <p className="text-[15px] text-gray-600 mb-8 pl-1 max-w-[95%] leading-relaxed">
          Please complete the form below so we can review the vehicle, verify availability with the seller, and assist you with the next steps.
        </p>

        <form onSubmit={handleSubmit} className="bg-[#fcfdfd] border border-[#f0f0f0] rounded-[24px] p-6 md:p-10 shadow-sm space-y-10">
          
          {/* Vehicle Information Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[30px] h-[30px] rounded-[6px] bg-[#3a5a46] flex items-center justify-center shadow-sm">
                <Car className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-[17px] font-medium text-gray-800">Vehicle Information *</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Vehicle Title / Name *</Label>
                <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. 2022 Toyota Camry" className="h-11 rounded-lg border-gray-200" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Make *</Label>
                <Input name="make" value={formData.make} onChange={handleInputChange} placeholder="e.g. Toyota" className="h-11 rounded-lg border-gray-200" required />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Year *</Label>
                <div className="relative">
                   <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <Input name="year" value={formData.year} onChange={handleInputChange} placeholder="2022" className="h-11 pl-10 rounded-lg border-gray-200" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Mileage</Label>
                <Input name="mileage" value={formData.mileage} onChange={handleInputChange} placeholder="e.g. 25,000 miles" className="h-11 rounded-lg border-gray-200" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Color</Label>
                <div className="relative">
                   <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <Input name="color" value={formData.color} onChange={handleInputChange} placeholder="e.g. Midnight Blue" className="h-11 pl-10 rounded-lg border-gray-200" />
                </div>
              </div>
              {/* 
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Listing URL *</Label>
                <Input name="listingUrl" value={formData.listingUrl} onChange={handleInputChange} placeholder="https://..." className="h-11 rounded-lg border-gray-200" required={false} />
              </div>
              */}
            </div>
          </section>

          {/* Seller Information Section - Commented out as requested */}
          {/* 
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[30px] h-[30px] rounded-[6px] bg-[#3a5a46] flex items-center justify-center shadow-sm">
                <User className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-[17px] font-medium text-gray-800">Seller Information *</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Seller Name *</Label>
                <Input placeholder="Enter seller name" className="h-11 rounded-lg border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Seller Phone Number *</Label>
                <Input placeholder="Enter seller phone number" className="h-11 rounded-lg border-gray-200" />
              </div>
            </div>
          </section>
          */}

          {/* Your Contact Information Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[30px] h-[30px] rounded-[6px] bg-[#3a5a46] flex items-center justify-center shadow-sm">
                <User className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-[17px] font-medium text-gray-800">Your Contact Information *</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Full Name *</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="h-11 rounded-lg border-gray-200" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Email Address *</Label>
                <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <Input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="john@example.com" className="h-11 pl-10 rounded-lg border-gray-200" required />
                </div>
              </div>
               <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-gray-600 ml-1">Phone Number</Label>
                <div className="flex gap-2">
                  <Select value={formData.phonePrefix} onValueChange={(val) => setFormData(prev => ({ ...prev, phonePrefix: val }))}>
                    <SelectTrigger className="w-[100px] h-11 rounded-lg border-gray-200 bg-white">
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
            
            <div className="flex flex-col items-center pt-10">
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-[380px] max-w-full h-[52px] bg-[#365646] hover:bg-[#2b4437] text-white rounded-[10px] font-medium text-[16px] transition-all active:scale-[0.98] shadow-md border border-[#2b4437]"
              >
                {isSubmitting ? "Sending Inquiry..." : "Send My Vehicle"}
              </Button>
            </div>
          </section>

        </form>
      </main>

      <Footer />
    </div>
  );
};

export default FindVehicle;
