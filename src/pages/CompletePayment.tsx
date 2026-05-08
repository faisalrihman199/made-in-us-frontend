import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Header from '@/components/Header';
import InvoiceTemplate from '@/components/InvoiceTemplate';
import { countries, countryCodes } from '@/lib/countries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ShieldCheck, 
  ChevronDown, 
  Download, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Car, 
  Calendar, 
  DollarSign,
  Globe
} from 'lucide-react';

const CompletePayment = () => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    address: '',
    country: 'United States',
    phonePrefix: '+1',
    phone: '',
    email: '',
    make: '',
    year: '2022',
    price: '20000',
    vin: ''
  });

  const invoiceRef = React.useRef<HTMLDivElement>(null);

  const processingFee = 350;
  const priceNum = parseFloat(formData.price) || 0;
  const percentageFee = priceNum * 0.03;
  const totalAmount = priceNum + processingFee + percentageFee;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // This is no longer used as per user request
  };

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) return;
    
    setIsSubmitting(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${formData.firstName}_${formData.lastName}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f4f9] flex flex-col font-sans text-[#1a2b3c]">
      <Header />
      
      <main className="flex-1 py-12 px-4 md:py-20">
        <div className="max-w-[850px] mx-auto bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] overflow-hidden">
          
          {/* Top Header Section */}
          <div className="p-6 md:p-10 pb-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#107050] rounded-lg flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#0b2447]">SecurePay</span>
            </div>

            <h1 className="text-3xl md:text-[36px] font-bold text-[#0b2447] mb-3 leading-tight">
              Complete your vehicle payment
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl font-medium">
              Fill out the form to securely complete your vehicle payment. A processing fee of 
              <span className="text-[#107050] font-bold mx-1">$350</span> and 
              <span className="text-[#107050] font-bold mx-1">3%</span> of the vehicle price will apply.
            </p>
          </div>

          <div className="px-6 md:px-10 pb-10 space-y-8">
            
            {/* Client Information Section */}
            <div className="space-y-4">
              <div className="bg-[#f2f8f6] py-2 px-4 rounded-lg border-l-4 border-[#107050]">
                <h2 className="text-lg font-bold text-[#0b2447] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#107050]" />
                  Client Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-600 ml-1">Last Name</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-slate-50/50 focus:border-[#107050] focus:ring-4 focus:ring-[#107050]/5 transition-all outline-none text-base font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-600 ml-1">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-slate-50/50 focus:border-[#107050] focus:ring-4 focus:ring-[#107050]/5 transition-all outline-none text-base font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-600 ml-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 focus:border-[#107050] focus:ring-4 focus:ring-[#107050]/5 transition-all outline-none text-base font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-600 ml-1">Country</label>
                  <Select value={formData.country} onValueChange={(val) => handleSelectChange('country', val)}>
                    <SelectTrigger className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-slate-50/50 focus:border-[#107050] focus:ring-4 focus:ring-[#107050]/5 font-medium text-left">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <SelectValue placeholder="Select Country" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-600 ml-1">Phone</label>
                  <div className="flex gap-2">
                    <Select value={formData.phonePrefix} onValueChange={(val) => handleSelectChange('phonePrefix', val)}>
                      <SelectTrigger className="w-24 h-11 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:border-[#107050] focus:ring-4 focus:ring-[#107050]/5 font-bold">
                        <SelectValue placeholder="+1" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((c) => (
                          <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="relative flex-1">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="tel" 
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 focus:border-[#107050] focus:ring-4 focus:ring-[#107050]/5 transition-all outline-none text-base font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-600 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 focus:border-[#107050] focus:ring-4 focus:ring-[#107050]/5 transition-all outline-none text-base font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Information Section */}
            <div className="space-y-4">
              <div className="bg-[#f2f8f6] py-2 px-4 rounded-lg border-l-4 border-[#107050]">
                <h2 className="text-lg font-bold text-[#0b2447] flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#107050]" />
                  Vehicle Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-[13px] font-semibold text-slate-600 ml-1">Make</label>
                  <input 
                    type="text" 
                    name="make"
                    placeholder="Make"
                    value={formData.make}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-slate-50/50 focus:border-[#107050] focus:ring-4 focus:ring-[#107050]/5 transition-all outline-none text-base font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-600 ml-1">Year</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      name="year"
                      placeholder="2022"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 focus:border-[#107050] focus:ring-4 focus:ring-[#107050]/5 transition-all outline-none text-base font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-600 ml-1">Price (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      name="price"
                      placeholder="20,000"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full h-11 pl-11 pr-4 rounded-lg border border-slate-200 bg-slate-50/50 focus:border-[#107050] focus:ring-4 focus:ring-[#107050]/5 transition-all outline-none text-base font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-600 ml-1">VIN / Serial Number</label>
                  <input 
                    type="text" 
                    name="vin"
                    placeholder="VIN Number"
                    value={formData.vin}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-slate-50/50 focus:border-[#107050] focus:ring-4 focus:ring-[#107050]/5 transition-all outline-none text-base font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Price Breakdown and Total */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex justify-end">
                <div className="w-full md:w-72 space-y-2">
                  <div className="flex justify-between items-center text-slate-600 text-[14px]">
                    <span className="font-medium">• Processing fee:</span>
                    <span className="font-bold text-slate-900">{processingFee.toLocaleString()} $</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 text-[14px]">
                    <span className="font-medium">• 3% of vehicle price:</span>
                    <span className="font-bold text-slate-900">{percentageFee.toLocaleString()} $</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-lg font-bold text-[#0b2447]">Total amount:</span>
                    <span className="text-2xl font-extrabold text-[#107050]">
                      {totalAmount.toLocaleString()} $
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
                <button 
                  onClick={handleDownloadInvoice}
                  disabled={isSubmitting}
                  className="w-full md:w-[320px] h-14 bg-[#107050] hover:bg-[#0c5940] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="animate-pulse">Generating PDF...</span>
                    </div>
                  ) : (
                    <>
                      <Download className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span>Download Invoice</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Hidden Invoice for Export */}
            <InvoiceTemplate 
              ref={invoiceRef}
              invoiceNo="MIUS-SP-0001"
              date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              clientInfo={{
                firstName: formData.firstName || 'Client',
                lastName: formData.lastName || 'Name',
                address: formData.address || 'Address not provided',
                country: formData.country,
                phone: `${formData.phonePrefix}${formData.phone}` || 'Phone not provided',
                email: formData.email || 'Email not provided'
              }}
              vehicleInfo={{
                make: formData.make || 'Vehicle Make',
                model: '', // Optional in image
                year: formData.year,
                vin: formData.vin || 'VIN not provided',
                price: priceNum
              }}
              pricing={{
                processingFee,
                serviceFee: percentageFee,
                totalAmount
              }}
            />

          </div>
        </div>
      </main>
    </div>
  );
};

export default CompletePayment;
