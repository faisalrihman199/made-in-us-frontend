import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, CheckCircle2, Ship, MapPin, Car, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { submitShippingQuote } from "@/lib/api";

interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShippingModal: React.FC<ShippingModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    destination: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitShippingQuote(formData);
      onClose();
      navigate("/confirmation");
    } catch (error) {
      toast.error("Failed to send request", {
        description: "Please check your information and try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-y-auto max-h-[95vh] rounded-[32px] border-none shadow-2xl bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="relative">
          {/* Header Section */}
          <div className="pt-10 px-8 pb-6 flex flex-col items-center text-center bg-gradient-to-b from-emerald-50/50 to-white">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="MADE-IN-US.COM" className="h-12 object-contain" />
            </div>

            <h2 className="text-[32px] md:text-[40px] font-bold text-[#1a1a1a] leading-tight mb-4 tracking-tight">
              Vehicle Shipping Solutions
            </h2>

            <p className="text-gray-600 text-[16px] md:text-[18px] leading-relaxed max-w-[580px] mb-8 font-medium">
              We provide seamless logistics from the United States to any destination port worldwide with full insurance and tracking.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-left max-w-[600px] mx-auto w-full mb-4">
              {[
                "Insured international transport",
                "Customs & export handling",
                "Transparent container rates",
                "Real-time shipment tracking"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[14px] text-gray-700 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-[#10b981] flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Form Section */}
          <div className="p-8 space-y-8">
            <div className="text-center space-y-1">
              <h3 className="text-[24px] font-bold text-gray-900">Request Your Quote</h3>
              <p className="text-slate-500 font-medium">Our logistics experts will analyze your route and provide the best possible rate.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-[12px] font-bold text-slate-400 uppercase tracking-wider ml-1">First Name</Label>
                  <Input id="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="John" className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-[12px] font-bold text-slate-400 uppercase tracking-wider ml-1">Last Name</Label>
                  <Input id="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Doe" className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[12px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" className="pl-11 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-[12px] font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input id="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+1 (555) 000-0000" className="pl-11 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="destination" className="text-[12px] font-bold text-slate-400 uppercase tracking-wider ml-1">Destination Port / City</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="destination" value={formData.destination} onChange={handleInputChange} required placeholder="Dubai, UAE (Jebel Ali)" className="pl-11 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="vehicleYear" className="text-[12px] font-bold text-slate-400 uppercase tracking-wider ml-1">Year</Label>
                  <Input id="vehicleYear" value={formData.vehicleYear} onChange={handleInputChange} required placeholder="2022" className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-center" />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="vehicleMake" className="text-[12px] font-bold text-slate-400 uppercase tracking-wider ml-1">Vehicle Make & Model</Label>
                  <div className="flex gap-2">
                    <Input id="vehicleMake" value={formData.vehicleMake} onChange={handleInputChange} required placeholder="Make (e.g. Ford)" className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" />
                    <Input id="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} required placeholder="Model (e.g. F-150)" className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-[12px] font-bold text-slate-400 uppercase tracking-wider ml-1">Additional Requirements</Label>
                <Textarea id="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us more about your shipping needs..." className="min-h-[100px] rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all resize-none" />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 bg-[#107050] hover:bg-[#0c5940] text-white font-bold rounded-2xl text-xl shadow-xl shadow-emerald-900/10 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? "Processing..." : "Get My Shipping Quote"}
              </Button>
            </form>
          </div>

          {/* Footer Info */}
          <div className="p-8 bg-slate-50 space-y-4 rounded-b-[32px] border-t border-slate-100">
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Ship className="w-5 h-5 text-emerald-600" />
               </div>
               <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Worldwide Sea Freight</h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    We specialize in RORO and Container shipping from all major US ports including Newark, Savannah, Houston, and Long Beach.
                  </p>
               </div>
            </div>
            <div className="pt-2 text-center">
               <p className="text-[12px] text-slate-400">
                  By submitting this form, you agree to our terms of service and shipping policies.
               </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingModal;

