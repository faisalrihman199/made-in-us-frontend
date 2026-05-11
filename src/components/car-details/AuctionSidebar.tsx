import React, { useState } from 'react';
import { Mail, Phone, MapPin, Check, Globe, User, Tag, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { submitInquiry, type CarDetailsResponse } from "@/lib/api";
import { usePrice } from "@/hooks/usePrice";
import RequestCallModal from "../modals/RequestCallModal";
import { countries, countryCodes } from "@/lib/countries";

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
    countryCode: '+1',
    country: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const field = id.includes('-') ? id.split('-')[1] : id;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
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
        phone: formData.phone ? `${formData.countryCode}${formData.phone}` : null,
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
      <div className="text-center mb-5">
        <h2 className="text-[32px] sm:text-[36px] tracking-tight font-black text-[#0a2e1f] leading-none mb-1.5">
          {formattedPrice}
        </h2>
        <p className="text-[#6A7870] text-[12px] sm:text-[13px] font-medium leading-tight px-4">
          Available for export & U.S. delivery
        </p>
      </div>

      {/* Main Buttons Section */}
      <div className="space-y-3 mb-7">
        {/* Check Availability Button */}
        <button 
          type="button"
          onClick={() => setIsAvailabilityModalOpen(true)}
          className="w-full h-[54px] bg-gradient-to-r from-[#1a4d2e] via-[#2d6a3e] to-[#40916c] hover:opacity-95 transition-all text-white border-0 rounded-[16px] flex items-center px-4 gap-3 shadow-lg shadow-green-900/5 cursor-pointer active:scale-[0.98] group"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M9 16l2 2 4-4"></path></svg>
          </div>
          <span className="text-[14px] sm:text-[15px] font-bold tracking-tight flex-1 text-left whitespace-nowrap">Check Availability</span>
          <ChevronRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>

        {/* Request a Call Box */}
        <div 
          onClick={() => setIsCallModalOpen(true)}
          className="w-full border border-gray-100 rounded-[16px] p-3.5 flex flex-col gap-3 cursor-pointer hover:bg-gray-50 transition-all group bg-white shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#1a4d2e] shrink-0">
                <Phone className="w-4 h-4 fill-current" />
              </div>
              <div className="text-left">
                <h4 className="text-[14px] font-bold text-[#1b2533] leading-tight">Request a Call</h4>
                <p className="text-[12px] text-gray-400 font-medium">Contact our team</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
          </div>
          
          <div className="flex items-center gap-1.5 bg-[#f0fdf4] border border-[#dcfce7] px-2.5 py-1.5 rounded-lg self-start">
            <Clock className="w-3 h-3 text-[#16a34a]" />
            <span className="text-[10px] font-bold text-[#16a34a] whitespace-nowrap uppercase tracking-wide">Response within 24h</span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-1 mb-7 border-t border-gray-50 pt-6">
        <div className="flex flex-col items-center text-center px-1">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mb-2">
            <ShieldCheck className="w-4 h-4 text-[#1b2533] opacity-70" />
          </div>
          <h5 className="text-[10px] sm:text-[11px] font-extrabold text-[#1b2533] leading-tight mb-0.5 min-h-[24px] flex items-center justify-center">Secure & Trusted</h5>
          <p className="text-[9px] text-gray-400 font-medium leading-tight hidden sm:block">Secure process end-to-end</p>
        </div>
        <div className="flex flex-col items-center text-center border-x border-gray-50 px-1">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mb-2">
            <Globe className="w-4 h-4 text-[#1b2533] opacity-70" />
          </div>
          <h5 className="text-[10px] sm:text-[11px] font-extrabold text-[#1b2533] leading-tight mb-0.5 min-h-[24px] flex items-center justify-center">Export & Delivery</h5>
          <p className="text-[9px] text-gray-400 font-medium leading-tight hidden sm:block">Handling all shipping</p>
        </div>
        <div className="flex flex-col items-center text-center px-1">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mb-2">
            <Tag className="w-4 h-4 text-[#1b2533] opacity-70" />
          </div>
          <h5 className="text-[10px] sm:text-[11px] font-extrabold text-[#1b2533] leading-tight mb-0.5 min-h-[24px] flex items-center justify-center">Clear Pricing</h5>
          <p className="text-[9px] text-gray-400 font-medium leading-tight hidden sm:block">No hidden upfront fees</p>
        </div>
      </div>

      {/* Location Card */}
      <div className="bg-[#f8fafc] rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#1b2533] opacity-70" />
          </div>
          <span className="text-[14px] font-bold text-[#1b2533] truncate">{location}</span>
        </div>
        <div className="h-px bg-gray-200/40 w-full mb-3.5"></div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-emerald-700 stroke-[4]" />
            </div>
            <span className="text-[12px] text-gray-600 font-bold">Worldwide shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-emerald-700 stroke-[4]" />
            </div>
            <span className="text-[12px] text-gray-600 font-bold">Inspection welcome</span>
          </div>
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

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="avail-firstName" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">First Name</Label>
                  <Input id="avail-firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-semibold focus:ring-[#2f884d]/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avail-lastName" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Last Name</Label>
                  <Input id="avail-lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-semibold focus:ring-[#2f884d]/20 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avail-email" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="avail-email" type="email" value={formData.email} onChange={handleInputChange} placeholder="name@example.com" className="pl-11 h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium focus:ring-[#2f884d]/20 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Country</Label>
                <Select value={formData.country} onValueChange={(val) => handleSelectChange('country', val)}>
                  <SelectTrigger className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <SelectValue placeholder="Select country" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-[100px,1fr] gap-3">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Code</Label>
                  <Select value={formData.countryCode} onValueChange={(val) => handleSelectChange('countryCode', val)}>
                    <SelectTrigger className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-bold">
                      <SelectValue placeholder="+1" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {countryCodes.map((c) => (
                        <SelectItem key={c.code} value={c.code} className="font-bold">{c.code}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avail-phone" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Phone (Optional)</Label>
                  <Input id="avail-phone" value={formData.phone} onChange={handleInputChange} placeholder="(555) 000-0000" className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium focus:ring-[#2f884d]/20 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avail-zipCode" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Zip Code</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input id="avail-zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="12345" className="pl-11 h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium focus:ring-[#2f884d]/20 transition-all" />
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
      <RequestCallModal 
        isOpen={isCallModalOpen} 
        onOpenChange={setIsCallModalOpen}
        listingId={car?.id}
        listingUrl={window.location.href}
      />

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
                <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Code</Label>
                <Select value={formData.countryCode} onValueChange={(val) => handleSelectChange('countryCode', val)}>
                  <SelectTrigger className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-bold">
                    <SelectValue placeholder="+1" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {countryCodes.map((c) => (
                      <SelectItem key={c.code} value={c.code} className="font-bold">{c.code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-phone" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</Label>
                <Input id="email-phone" value={formData.phone} onChange={handleInputChange} placeholder="(555) 000-0000" className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Country</Label>
              <Select value={formData.country} onValueChange={(val) => handleSelectChange('country', val)}>
                <SelectTrigger className="h-11 bg-gray-50/50 border-gray-100 rounded-xl font-medium">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="Select country" />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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