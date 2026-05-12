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
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";
import { submitInquiry } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { countryCodes } from "@/lib/countries";

const Contact = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phonePrefix: "+1",
    phone: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSend = {
        ...formData,
        phone: `${formData.phonePrefix}${formData.phone}`
      };
      await submitInquiry({
        ...dataToSend,
        type: "GENERAL",
        listingId: null
      });
      navigate("/confirmation");
    } catch (error) {
      toast.error("Failed to send message", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const locations = [
    {
      state: "Wyoming",
      address: ["Made in US Marketplace LLC", "30 N Gould St Ste N", "Sheridan, WY 82801", "USA"],
      usPhone: "+1 (307) 210-7772",
      euPhone: "+1 863 266 1140",
      icon: (
        <svg viewBox="0 0 64 64" className="w-8 h-8 text-white" fill="currentColor">
          <path d="M32 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 20c-8.8 0-16 4.5-16 10v4h32v-4c0-5.5-7.2-10-16-10z" />
          <path d="M12 48h40v4H12z" />
        </svg>
      )
    },
    {
      state: "Florida",
      address: ["Address: 501 E Kennedy Blvd", "Tampa, FL 33602, USA"],
      usPhone: "+1 (307) 210-7772",
      euPhone: "+1 863 266 1140",
      icon: (
        <svg viewBox="0 0 64 64" className="w-8 h-8 text-white" fill="currentColor">
          <path d="M32 8c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2s2-.9 2-2V10c0-1.1-.9-2-2-2z" />
          <path d="M48 24c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM16 24c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" />
        </svg>
      )
    },
    {
      state: "California (Los Angeles)",
      address: ["Address: 6060 Center Drive", "Los Angeles, CA 90045 USA"],
      usPhone: "+1 (307) 210-7772",
      euPhone: "+1 863 266 1140",
      icon: (
        <svg viewBox="0 0 64 64" className="w-8 h-8 text-white" fill="currentColor">
          <path d="M32 10l-4 8h8l-4-8zM20 30l-4 8h8l-4-8zM44 30l-4 8h8l-4-8z" />
          <path d="M10 50h44v4H10z" />
        </svg>
      )
    },
    {
      state: "California (San Francisco)",
      address: ["Address: 95 3rd Street", "San Francisco, CA 94103, USA"],
      usPhone: "+1 (307) 210-7772",
      euPhone: "+1 863 266 1140",
      icon: (
        <svg viewBox="0 0 64 64" className="w-8 h-8 text-white" fill="currentColor">
          <path d="M10 32h44M10 40h44M32 10v44" stroke="currentColor" strokeWidth="4" />
        </svg>
      )
    },
    {
      state: "Texas",
      address: ["Address: 701 Brazos St", "Austin, TX 78701, USA"],
      usPhone: "+1 (307) 210-7772",
      euPhone: "+1 863 266 1140",
      icon: (
        <svg viewBox="0 0 64 64" className="w-8 h-8 text-white" fill="currentColor">
          <path d="M32 10l5 12h13l-10 8 4 12-12-8-12 8 4-12-10-8h13l5-12z" />
        </svg>
      )
    },
    {
      state: "New York",
      address: ["Address: 2963 James St", "Syracuse, NY 13206, USA"],
      usPhone: "+1 (307) 210-7772",
      euPhone: "+1 863 266 1140",
      icon: (
        <svg viewBox="0 0 64 64" className="w-8 h-8 text-white" fill="currentColor">
          <path d="M32 8l4 12h12l-10 8 4 12-10-8-10 8 4-12-10-8h12l4-12z" />
          <path d="M28 44h8v12h-8z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 pt-12 pb-24">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-[36px] md:text-[44px] font-black text-[#0A2E1F] tracking-tight mb-4 uppercase" style={{ fontFamily: "Arial Black, sans-serif" }}>
            Get in Touch
          </h1>
          <p className="text-[16px] md:text-[18px] text-gray-500 font-medium leading-relaxed max-w-2xl">
            Whether you are looking for a vehicle, need export assistance, or want to request
            more information, our team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          {/* Form Side */}
          <div className="lg:sticky lg:top-24 bg-white border border-gray-100 rounded-[32px] p-8 md:p-10 shadow-xl shadow-gray-200/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-[#0A2E1F] flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
              </div>
              <h2 className="text-[22px] font-black text-[#0A2E1F] uppercase" style={{ fontFamily: "Arial Black, sans-serif" }}>Contact Form</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name *</Label>
                  <Input 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name" 
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#60E677] focus:ring-4 focus:ring-[#60E677]/5 transition-all text-base font-bold placeholder:text-gray-300" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name *</Label>
                  <Input 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name" 
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#60E677] focus:ring-4 focus:ring-[#60E677]/5 transition-all text-base font-bold placeholder:text-gray-300" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</Label>
                  <Input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com" 
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#60E677] focus:ring-4 focus:ring-[#60E677]/5 transition-all text-base font-bold placeholder:text-gray-300" 
                  />
                </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</Label>
                <div className="flex gap-3">
                  <Select value={formData.phonePrefix} onValueChange={(val) => handleSelectChange("phonePrefix", val)}>
                    <SelectTrigger className="w-[110px] h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white font-bold">
                      <SelectValue placeholder="+1" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {countryCodes.map((c) => (
                        <SelectItem key={c.code} value={c.code} className="font-bold">{c.code}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number" 
                    className="flex-1 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#60E677] focus:ring-4 focus:ring-[#60E677]/5 transition-all text-base font-bold placeholder:text-gray-300" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Message</Label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us how we can help..."
                  className="min-h-[150px] rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#60E677] focus:ring-4 focus:ring-[#60E677]/5 transition-all text-base font-medium placeholder:text-gray-300 resize-none py-4 px-5"
                />
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-16 bg-[#0A2E1F] hover:bg-[#1D4D3A] text-[#60E677] rounded-2xl font-black text-lg uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl shadow-[#0A2E1F]/20"
              >
                {isSubmitting ? "Sending Message..." : "Send Message"}
              </Button>
            </div>
          </div>

          {/* Locations Side */}
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-[28px] font-black text-[#0A2E1F] uppercase mb-2" style={{ fontFamily: "Arial Black, sans-serif" }}>Our Locations</h2>
              <div className="w-10 h-1 bg-[#2f884d] mx-auto rounded-full" />
            </div>

            <div className="grid gap-6">
              {locations.map((loc, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex gap-6">
                    {/* Icon Circle */}
                    <div className="w-14 h-14 rounded-full bg-[#0A2E1F] flex items-center justify-center shrink-0 shadow-lg">
                      {loc.icon}
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-black text-[#0A2E1F] mb-2">{loc.state}</h3>
                        <div className="space-y-0.5">
                          {loc.address.map((line, i) => (
                            <p key={i} className="text-[14px] text-gray-500 font-bold">{line}</p>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">U.S. Clients</span>
                            <span className="text-base font-black text-[#0A2E1F]">{loc.usPhone}</span>
                          </div>
                          <a 
                            href={`https://wa.me/${loc.usPhone.replace(/[^\d]/g, '')}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[#25D366] hover:bg-green-50 transition-colors"
                          >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                          </a>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">European Clients</span>
                            <span className="text-base font-black text-[#0A2E1F]">{loc.euPhone}</span>
                          </div>
                          <a 
                            href={`https://wa.me/${loc.euPhone.replace(/[^\d]/g, '')}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-[#25D366] hover:bg-green-50 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter Bar - Matching your image exactly */}
            <div className="bg-[#052c16] rounded-[10px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 mt-4 shadow-xl">
              <div className="flex items-center gap-6">
                <div className="shrink-0">
                  <svg viewBox="0 0 50 40" className="w-16 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                     <rect x="2" y="5" width="46" height="30" rx="3" />
                     <path d="M2 5l23 16L48 5" />
                     <line x1="18" y1="24" x2="22" y2="27" />
                  </svg>
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-white text-[22px] font-bold tracking-tight leading-tight">Don't Miss Any Updates!</h4>
                  <p className="text-white/90 text-[15px] font-medium leading-relaxed">
                    Subscribe to our newsletter and get the latest articles and tips straight to your inbox.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 w-full md:w-[300px] lg:w-[280px] xl:w-[350px] shrink-0">
                <Input 
                  placeholder="Enter your email address..." 
                  className="bg-white border-none rounded-[10px] h-12 text-[#999] font-normal px-4 text-base"
                />
                <Button className="bg-[#2f884d] hover:bg-[#25733f] text-white font-bold h-12 rounded-[10px] text-lg shadow-sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
