import React, { useState } from 'react';
import { Phone, Globe, Lock, Check, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { submitInquiry } from "@/lib/api";

const countryCodes = [
  { code: "+1", country: "US/CA" },
  { code: "+44", country: "UK" },
  { code: "+33", country: "FR" },
  { code: "+49", country: "DE" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "KSA" },
  { code: "+92", country: "PK" },
  { code: "+91", country: "IN" },
  { code: "+61", country: "AU" },
  { code: "+81", country: "JP" },
  { code: "+86", country: "CN" },
];

const countries = [
  "United States", "United Kingdom", "France", "Germany", "United Arab Emirates", 
  "Saudi Arabia", "Canada", "Australia", "Japan", "China", "Pakistan", "India",
  "Netherlands", "Belgium", "Switzerland", "Spain", "Italy", "Portugal"
];

interface RequestCallModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  listingId?: string;
  listingUrl?: string;
}

const RequestCallModal = ({ isOpen, onOpenChange, listingId, listingUrl }: RequestCallModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    countryCode: '+1',
    country: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.country) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry({
        listingId: listingId || null,
        type: 'CALL',
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        countryCode: formData.countryCode,
        country: formData.country,
        message: listingId ? `Request a call for vehicle listing #${listingId}` : "Request a call from general page",
        listingUrl: listingUrl || window.location.href
      });
      
      toast.success("Request sent!", {
        description: "We'll call you back shortly."
      });
      onOpenChange(false);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        countryCode: '+1',
        country: ''
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-y-auto max-h-[calc(100vh-4rem)] my-8 rounded-[32px] border-none shadow-2xl bg-white scrollbar-hide">
        <div className="p-8 sm:p-10 space-y-8">
          <DialogHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-[28px] font-bold tracking-tight text-[#1b2533]">
                Request a call
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-500 text-[15px]">
              Please fill in your details and we'll call you back.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[14px] font-bold text-[#1b2533] ml-0.5">First name</Label>
                <Input 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name" 
                  className="h-13 bg-white border-gray-200 rounded-2xl font-medium focus:ring-2 focus:ring-[#2f884d]/10 focus:border-[#2f884d] transition-all placeholder:text-gray-400" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[14px] font-bold text-[#1b2533] ml-0.5">Last name</Label>
                <Input 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name" 
                  className="h-13 bg-white border-gray-200 rounded-2xl font-medium focus:ring-2 focus:ring-[#2f884d]/10 focus:border-[#2f884d] transition-all placeholder:text-gray-400" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[14px] font-bold text-[#1b2533] ml-0.5">Phone number</Label>
                <div className="flex gap-2">
                  <Select 
                    value={formData.countryCode} 
                    onValueChange={(val) => setFormData(prev => ({ ...prev, countryCode: val }))}
                  >
                    <SelectTrigger className="w-[110px] h-13 bg-white border-gray-200 rounded-2xl font-bold text-[#1b2533] focus:ring-2 focus:ring-[#2f884d]/10 transition-all">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#2f884d] shrink-0" />
                        <SelectValue placeholder="+1" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                      {countryCodes.map((c) => (
                        <SelectItem key={c.code} value={c.code} className="rounded-xl font-bold py-3">
                          {c.code} <span className="text-gray-400 font-medium ml-1">({c.country})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input 
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number" 
                    className="flex-1 h-13 bg-white border-gray-200 rounded-2xl font-medium focus:ring-2 focus:ring-[#2f884d]/10 focus:border-[#2f884d] transition-all placeholder:text-gray-400" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[14px] font-bold text-[#1b2533] ml-0.5">Country</Label>
                <Select 
                  value={formData.country} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, country: val }))}
                >
                  <SelectTrigger className="h-13 bg-white border-gray-200 rounded-2xl font-medium text-[#1b2533] focus:ring-2 focus:ring-[#2f884d]/10 transition-all">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-[#2f884d] shrink-0" />
                      <SelectValue placeholder="Select your country" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] rounded-2xl border-gray-100 shadow-xl">
                    {countries.map((c) => (
                      <SelectItem key={c} value={c} className="rounded-xl font-medium py-3">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <Button
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full h-14 text-[17px] font-bold rounded-2xl bg-[#376b3f] hover:bg-[#2d5733] text-white shadow-lg shadow-green-900/10 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </div>
                ) : (
                  "Request a call"
                )}
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[12px] font-medium tracking-tight">Your information is safe and secure.</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestCallModal;
