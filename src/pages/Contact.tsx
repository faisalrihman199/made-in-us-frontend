import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";
import { submitInquiry } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Contact = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { placeholder, value } = e.target;
    const keyMap: Record<string, string> = {
      "First Name": "firstName",
      "Last Name": "lastName",
      "Email Address": "email",
      "Phone Number": "phone",
      "Message": "message"
    };
    const key = keyMap[placeholder];
    if (key) {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry({
        ...formData,
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
      usPhone: "863 266 1140",
      euPhone: "+1 863 266 1140"
    },
    {
      state: "Florida",
      address: ["Address: Florida, USA"],
      usPhone: "863 266 1140",
      euPhone: "+1 863 266 1140"
    },
    {
      state: "California",
      address: ["Address: 6060 Center Drive", "Los Angeles, CA 90045 USA"],
      usPhone: "863 266 1140",
      euPhone: "+1 863 266 1140"
    },
    {
      state: "California (San Francisco)",
      address: ["Address: 95 3rd Street.", "San Francisco, CA 94103, USA"],
      usPhone: "863 266 1140",
      euPhone: "+1 863 266 1140"
    },
    {
      state: "Texas",
      address: ["Address: 701 Brazos St", "Austin, TX 78701, USA"],
      usPhone: "863 266 1140",
      euPhone: "+1 863 266 1140"
    },
    {
      state: "New York",
      address: ["Address: 2963 James St", "Syracuse, NY 13206, USA"],
      usPhone: "863 266 1140",
      euPhone: "+1 863 266 1140"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />

      <main className="max-w-[1000px] mx-auto px-4 pt-12 pb-24">
        <div className="mb-10 max-w-3xl">
          <h1 className="text-[32px] md:text-[38px] font-semibold text-[#30453d] tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-[15px] md:text-[16px] text-[#4a4a4a] leading-relaxed">
            Whether you are looking for a vehicle, need export assistance, or want to request<br className="hidden md:block" />
            more information, our team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 items-start">
          <div className="lg:sticky lg:top-24 bg-[#fcfdfd] border border-gray-100 rounded-[20px] p-6 shadow-sm">
            <h2 className="text-[19px] font-medium text-[#2d3a34] mb-6">Contact Form</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[13px] font-medium text-[#2d3a34] ml-1">First Name *</Label>
                  <Input 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name" 
                    className="h-11 rounded-lg border-gray-200 bg-transparent focus:border-[#4a6458] focus:ring-1 focus:ring-[#4a6458] transition-all text-[14px] placeholder:text-gray-400 placeholder:font-light" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[13px] font-medium text-[#2d3a34] ml-1">Last Name *</Label>
                  <Input 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name" 
                    className="h-11 rounded-lg border-gray-200 bg-transparent focus:border-[#4a6458] focus:ring-1 focus:ring-[#4a6458] transition-all text-[14px] placeholder:text-gray-400 placeholder:font-light" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-[#2d3a34] ml-1">Email Address</Label>
                <Input 
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address" 
                  className="h-11 rounded-lg border-gray-200 bg-transparent focus:border-[#4a6458] focus:ring-1 focus:ring-[#4a6458] transition-all text-[14px] placeholder:text-gray-400 placeholder:font-light" 
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-[#2d3a34] ml-1">Phone Number</Label>
                <Input 
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number" 
                  className="h-11 rounded-lg border-gray-200 bg-transparent focus:border-[#4a6458] focus:ring-1 focus:ring-[#4a6458] transition-all text-[14px] placeholder:text-gray-400 placeholder:font-light" 
                />
              </div>

              <div className="space-y-1.5 pb-2">
                <Label className="text-[13px] font-medium text-[#2d3a34] ml-1">Message</Label>
                <Textarea
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Message"
                  className="min-h-[120px] rounded-lg border-gray-200 bg-transparent focus:border-[#4a6458] focus:ring-1 focus:ring-[#4a6458] transition-all text-[14px] placeholder:text-gray-400 placeholder:font-light resize-none py-3"
                />
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-[52px] bg-gradient-to-r from-[#446654] to-[#364f43] hover:from-[#364f43] hover:to-[#2c4036] text-white rounded-[10px] font-medium text-[15px] transition-all active:scale-[0.99] shadow-sm border-none"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 bg-[#fcfcfc] border border-gray-100 rounded-[20px] p-8 shadow-sm lg:h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide">
            <h2 className="text-[19px] font-medium text-[#2d3a34] mb-6">Our Locations</h2>

            <div className="space-y-8">
              {locations.map((loc, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#6c8577] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                  <div className="space-y-2">
                    <h3 className="text-[16px] font-semibold text-[#30453d] leading-none mb-2">{loc.state}</h3>

                    <div className="space-y-0.5">
                      {loc.address.map((line, i) => (
                        <p key={i} className="text-[14px] text-[#555] font-light">{line}</p>
                      ))}
                    </div>

                    <div className="pt-1 space-y-0.5">
                      <p className="text-[14px] text-[#555] font-light">
                        U.S. Clients: <span className="font-semibold text-[#444]">{loc.usPhone}</span>
                      </p>
                      <p className="text-[14px] text-[#555] font-light">
                        European Clients: {loc.euPhone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
