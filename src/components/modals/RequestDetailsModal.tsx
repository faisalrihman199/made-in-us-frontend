import React, { useState } from 'react';
import { FileText, Globe, Lock, Loader2, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { countries, countryCodes } from "@/lib/countries";


interface RequestDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string;
  listingUrl: string;
  vehicleTitle?: string;
}

const RequestDetailsModal = ({ isOpen, onOpenChange, listingId, listingUrl, vehicleTitle }: RequestDetailsModalProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+1',
    country: ''
  });

  React.useEffect(() => {
    if (isOpen) {
      const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (select && select.value && select.value !== 'en') {
        setTimeout(() => {
          select.dispatchEvent(new Event('change'));
        }, 100);
      }
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.country) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry({
        listingId,
        type: 'DETAILS',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        countryCode: formData.countryCode,
        country: formData.country,
        message: `Requesting full vehicle details for: ${vehicleTitle || "this vehicle"}`,
        listingUrl: listingUrl
      });
      
      onOpenChange(false);
      navigate("/confirmation");
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
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
      <DialogContent className="sm:max-w-[500px] p-0 overflow-y-auto max-h-[calc(100vh-4rem)] my-8 rounded-[32px] border-none shadow-2xl bg-white scrollbar-hide">
        <div className="p-8 sm:p-10 space-y-8">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-[28px] font-bold tracking-tight text-[#1b2533]">
              Request vehicle details
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-[15px]">
              Complete the form below to receive a detailed report, high-quality photos, and export pricing.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[14px] font-bold text-[#1b2533] ml-0.5">First name</Label>
                <Input 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John" 
                  className="h-12 bg-gray-50/50 border-gray-100 rounded-2xl font-medium focus:ring-2 focus:ring-[#2f884d]/10 focus:border-[#2f884d] transition-all" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[14px] font-bold text-[#1b2533] ml-0.5">Last name</Label>
                <Input 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe" 
                  className="h-12 bg-gray-50/50 border-gray-100 rounded-2xl font-medium focus:ring-2 focus:ring-[#2f884d]/10 focus:border-[#2f884d] transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[14px] font-bold text-[#1b2533] ml-0.5">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com" 
                  className="pl-11 h-12 bg-gray-50/50 border-gray-100 rounded-2xl font-medium focus:ring-2 focus:ring-[#2f884d]/10 focus:border-[#2f884d] transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[14px] font-bold text-[#1b2533] ml-0.5">Phone number</Label>
              <div className="flex gap-2">
                <Select 
                  value={formData.countryCode} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, countryCode: val }))}
                >
                  <SelectTrigger className="w-[110px] h-12 bg-gray-50/50 border-gray-100 rounded-2xl font-bold text-[#1b2533]">
                    <SelectValue placeholder="+1" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                    {countryCodes.map((c) => (
                      <SelectItem key={c.code} value={c.code} className="rounded-xl font-bold py-3">
                        {c.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone number" 
                  className="flex-1 h-12 bg-gray-50/50 border-gray-100 rounded-2xl font-medium focus:ring-2 focus:ring-[#2f884d]/10 focus:border-[#2f884d] transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[14px] font-bold text-[#1b2533] ml-0.5">Country</Label>
              <Select 
                value={formData.country} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, country: val }))}
              >
                <SelectTrigger className="h-12 bg-gray-50/50 border-gray-100 rounded-2xl font-medium text-[#1b2533]">
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

            <div className="space-y-4 pt-4">
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
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Request Vehicle Details
                  </div>
                )}
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[12px] font-medium">Get full vehicle information, export price, shipping options and more.</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsModal;
