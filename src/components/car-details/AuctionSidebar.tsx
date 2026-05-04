import React, { useState } from 'react';
import { Mail, Phone, MapPin, Check, Globe, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { submitInquiry, type CarDetailsResponse } from "@/lib/api";
import { usePrice } from "@/hooks/usePrice";

const CheckCircleSolid = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" />
    <path d="M7.5 12L10.5 15L16.5 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type AuctionSidebarProps = {
  car?: CarDetailsResponse;
};

const AuctionSidebar = ({ car }: AuctionSidebarProps) => {
  const navigate = useNavigate();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: '',
    message: '',
    countryCode: '',
    country: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    // Map IDs like 'email-firstName' or 'avail-firstName' to 'firstName'
    const field = id.includes('-') ? id.split('-')[1] : id;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInquirySubmit = async (type: 'AVAILABILITY' | 'CALL' | 'EMAIL') => {
    if (!car?.id) return;
    
    if (!formData.firstName || !formData.lastName) {
      toast.error("Please provide your name");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry({
        listingId: car.id,
        type,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || null,
        phone: formData.phone || null,
        zipCode: formData.zipCode || null,
        country: formData.country || null,
        countryCode: formData.countryCode || null,
        message: formData.message || null,
        listingUrl: window.location.href
      });
      
      setIsAvailabilityModalOpen(false);
      setIsCallModalOpen(false);
      setIsEmailModalOpen(false);
      navigate("/confirmation");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const price = car?.price ?? 0;
  const { formattedPrice } = usePrice(price);
  const location = car?.location?.trim() ? car.location : "Location coming soon";

  return (
    <div className="rounded-[20px] bg-white border border-[#E5ECE7] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.06)] p-6 md:p-8 w-full max-w-[420px] mx-auto font-sans">

      {/* Price Section */}
      <div className="text-center mb-6 mt-2">
        <h2 className="text-[44px] tracking-tight font-semibold text-[#255639] leading-none mb-3">
          {formattedPrice}
        </h2>
        <p className="text-[#6A7870] text-[15px]">
          Available for export & U.S. delivery
        </p>
      </div>

      {/* Main Buttons */}
      <div className="space-y-3.5 mb-8 text-[16px] font-medium">
        <button 
          type="button"
          onClick={() => setIsAvailabilityModalOpen(true)}
          className="w-full bg-gradient-to-r from-[#215E41] via-[#488251] to-[#80B66E] hover:opacity-95 transition-all text-white border-0 h-14 rounded-xl flex items-center justify-center shadow-sm cursor-pointer active:scale-[0.98]"
        >
          Check Availability
        </button>
        <button
          type="button"
          onClick={() => setIsEmailModalOpen(true)}
          className="w-full h-14 rounded-xl border border-[#E5ECE7] text-[#255639] hover:bg-[#F8FAF9] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
        >
          <Mail className="w-[18px] h-[18px] stroke-[2]" />
          Contact Us
        </button>
      </div>

      <div className="h-px bg-[#E5ECE7] w-full mb-6"></div>

      {/* Checklist */}
      <div className="space-y-4 mb-7 text-[16px] text-[#334138]">
        <div className="flex items-center gap-3.5">
          <CheckCircleSolid className="w-[22px] h-[22px] text-[#4DA45A] shrink-0" />
          <span>Verified Listing</span>
        </div>
        <div className="flex items-center gap-3.5">
          <CheckCircleSolid className="w-[22px] h-[22px] text-[#4DA45A] shrink-0" />
          <span>SecurePay Protection</span>
        </div>
        <div className="flex items-center gap-3.5">
          <CheckCircleSolid className="w-[22px] h-[22px] text-[#4DA45A] shrink-0" />
          <span>Worldwide Shipping</span>
        </div>
        <div className="flex items-center gap-3.5">
          <CheckCircleSolid className="w-[22px] h-[22px] text-[#4DA45A] shrink-0" />
          <span>National Transport</span>
        </div>
      </div>

      <div className="h-px bg-[#E5ECE7] w-full mb-6"></div>

      {/* Location */}
      <div className="mb-7">
        <div className="flex items-center gap-3.5 mb-3.5">
          <MapPin className="w-[22px] h-[22px] text-[#255639] shrink-0 stroke-[2]" />
          <span className="text-[17px] text-[#334138]">{location}</span>
        </div>
        <div className="pl-9 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <Check className="w-[18px] h-[18px] text-[#4DA45A] shrink-0 stroke-[3]" />
            <span className="text-[14px] text-[#6A7870]">Worldwide shipping available</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Check className="w-[18px] h-[18px] text-[#4DA45A] shrink-0 stroke-[3]" />
            <span className="text-[14px] text-[#6A7870]">Inspection welcome</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-[#E5ECE7] w-full mb-6"></div>

      {/* Expert Section */}
      <div>
        <div className="flex items-center gap-3.5 mb-5">
          <CheckCircleSolid className="w-[22px] h-[22px] text-[#4DA45A] shrink-0" />
          <span className="text-[17px] text-[#334138]">Speak with an expert</span>
        </div>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <button
            type="button"
            onClick={() => setIsCallModalOpen(true)}
            className="w-full h-[46px] rounded-xl border border-[#E5ECE7] text-[#255639] hover:bg-[#F8FAF9] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98] text-[14px] font-medium"
          >
            <Phone className="w-[16px] h-[16px] stroke-[2]" />
            Request a Call
          </button>
          <button
            type="button"
            onClick={() => setIsEmailModalOpen(true)}
            className="w-full h-[46px] rounded-xl border border-[#E5ECE7] text-[#255639] hover:bg-[#F8FAF9] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98] text-[14px] font-medium"
          >
            <Mail className="w-[16px] h-[16px] stroke-[2]" />
            Email
          </button>
        </div>
        <div className="text-center text-[#6A7870] text-[13px] mb-2">
          Response within 24h
        </div>
      </div>

      {/* Check Availability Modal */}
      <Dialog open={isAvailabilityModalOpen} onOpenChange={setIsAvailabilityModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-y-auto max-h-[calc(100vh-4rem)] rounded-3xl border-none shadow-2xl bg-white scrollbar-hide">
          <div className="p-8 space-y-5">
            <DialogHeader className="space-y-2 text-center">
              <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 flex items-center justify-center gap-2">
                <Check className="w-5 h-5 text-[#2f884d]" />
                Check Availability
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Please provide your contact information to check if this vehicle is still available.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="avail-firstName" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">First Name</Label>
                <Input id="avail-firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avail-lastName" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Last Name</Label>
                <Input id="avail-lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avail-email" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="avail-email" type="email" value={formData.email} onChange={handleInputChange} placeholder="name@example.com" className="pl-11 h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="avail-phone" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Phone (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="avail-phone" value={formData.phone} onChange={handleInputChange} placeholder="(555) 000-0000" className="pl-11 h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avail-zip" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Zip Code</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="avail-zip" value={formData.zipCode} onChange={handleInputChange} placeholder="12345" className="pl-11 h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avail-message" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Message</Label>
              <textarea 
                id="avail-message" 
                value={formData.message}
                onChange={handleInputChange}
                placeholder="I am interested in this vehicle..." 
                className="w-full min-h-[100px] p-4 bg-gray-50/50 border border-gray-100 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#2f884d]/20 resize-none"
              />
            </div>

            <Button
              disabled={isSubmitting}
              onClick={() => handleInquirySubmit('AVAILABILITY')}
              className="w-full h-12 text-base font-bold rounded-xl bg-[#2f884d] hover:bg-[#25733f] text-white shadow-lg shadow-green-100/50 transition-all active:scale-[0.98] mt-2"
            >
              {isSubmitting ? "Sending..." : "Submit Inquiry"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request a Call Modal */}
      <Dialog open={isCallModalOpen} onOpenChange={setIsCallModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-y-auto max-h-[calc(100vh-4rem)] rounded-3xl border-none shadow-2xl bg-white scrollbar-hide">
          <div className="p-8 space-y-6">
            <DialogHeader className="space-y-2 text-center">
              <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 flex items-center justify-center gap-2">
                <Phone className="w-5 h-5 text-[#2f884d]" />
                Request a Call
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Enter your details below and an expert will get back to you shortly.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">First Name</Label>
                <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Last Name</Label>
                <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-[1fr,2fr] gap-4">
              <div className="space-y-2">
                <Label htmlFor="countryCode" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Code</Label>
                <Input id="countryCode" value={formData.countryCode} onChange={handleInputChange} placeholder="+1" className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</Label>
                <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder=" (555) 000-0000" className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Country</Label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="country" value={formData.country} onChange={handleInputChange} placeholder="United States" className="pl-11 h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
              </div>
            </div>

            <Button
              disabled={isSubmitting}
              onClick={() => handleInquirySubmit('CALL')}
              className="w-full h-12 text-base font-bold rounded-xl bg-[#2f884d] hover:bg-[#25733f] text-white shadow-lg shadow-green-100/50 transition-all active:scale-[0.98] mt-2"
            >
              {isSubmitting ? "Sending..." : "Request Call Back"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Modal */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-y-auto max-h-[calc(100vh-4rem)] rounded-3xl border-none shadow-2xl bg-white scrollbar-hide">
          <div className="p-8 space-y-5">
            <DialogHeader className="space-y-2 text-center">
              <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 flex items-center justify-center gap-2">
                <Mail className="w-5 h-5 text-[#2f884d]" />
                Send Inquiry
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Fill in the form to receive a detailed response via email.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email-firstName" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">First Name</Label>
                <Input id="email-firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-lastName" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Last Name</Label>
                <Input id="email-lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-email" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="email-email" type="email" value={formData.email} onChange={handleInputChange} placeholder="name@example.com" className="pl-11 h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-[1fr,2fr] gap-4">
              <div className="space-y-2">
                <Label htmlFor="email-countryCode" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Code</Label>
                <Input id="email-countryCode" value={formData.countryCode} onChange={handleInputChange} placeholder="+1" className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-phone" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</Label>
                <Input id="email-phone" value={formData.phone} onChange={handleInputChange} placeholder=" (555) 000-0000" className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-country" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Country</Label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="email-country" value={formData.country} onChange={handleInputChange} placeholder="United States" className="pl-11 h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
              </div>
            </div>

            <Button
              disabled={isSubmitting}
              onClick={() => handleInquirySubmit('EMAIL')}
              className="w-full h-12 text-base font-bold rounded-xl bg-[#2f884d] hover:bg-[#25733f] text-white shadow-lg shadow-green-100/50 transition-all active:scale-[0.98] mt-2"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuctionSidebar;