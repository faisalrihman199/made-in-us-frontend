import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, Shield, Tag, Upload, Phone, Info, CheckCircle2, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { submitSubscription, getPaymentDetails, submitInquiry } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import RequestCallModal from "@/components/modals/RequestCallModal";
import { countries, countryCodes } from "@/lib/countries";

const Membership = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("12-month");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  useEffect(() => {
    getPaymentDetails().then(setPaymentDetails).catch(console.error);
  }, []);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+1",
    country: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [understoodNonRefundable, setUnderstoodNonRefundable] = useState(false);

  const plans = [
    {
      id: "6-month",
      name: "6-Month Plan",
      price: "$499",
      icon: <Tag className="w-5 h-5 text-white" />,
      features: [
        "Up to 5-8 custom quotes",
        "Direct contact with U.S. sellers",
        "Vehicle verification",
        "Full export quote",
        "Priority support"
      ]
    },
    {
      id: "12-month",
      name: "12-Month Plan",
      price: "$890",
      icon: <Tag className="w-5 h-5 text-white" />,
      features: [
        "Up to 10-15 custom quotes",
        "Priority access to listings",
        "Negotiation included",
        "Full export quote",
        "Premium support"
      ]
    },
    {
      id: "vip",
      name: "VIP Plan",
      price: "$2,500 / year",
      icon: <Shield className="w-5 h-5 text-white" />,
      badge: "Best Value",
      features: [
        "Unlimited requests (3 active at a time) *",
        "Ultra priority",
        "Advanced negotiation",
        "Access to exclusive vehicles",
        "Dedicated support until delivery"
      ]
    }
  ];


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, country: value }));
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.country) {
      toast.error("Required fields missing", { description: "Please complete Step 1." });
      return;
    }

    if (!agreedToTerms || !understoodNonRefundable) {
      toast.error("Terms not accepted", { description: "Please agree to the terms and understanding in Step 4." });
      return;
    }

    if ((paymentMethod === "bank" || paymentMethod === "paypal") && !paymentProof) {
      toast.error("Payment proof missing", { description: "Please upload your receipt for verification." });
      return;
    }

    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    setIsSubmitting(true);
    try {
      await submitSubscription({
        ...formData,
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        paymentMethod
      }, paymentProof || undefined);

      navigate("/confirmation");
    } catch (error) {
      toast.error("Failed to submit application", { description: "Please try again later or contact support." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInquirySubmit = async (type: 'AVAILABILITY' | 'CALL' | 'EMAIL') => {
    if (!formData.fullName) {
      toast.error("Please provide your name");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry({
        type,
        firstName: formData.fullName.split(' ')[0] || "",
        lastName: formData.fullName.split(' ').slice(1).join(' ') || "User",
        email: formData.email || null,
        phone: formData.phone || null,
        country: formData.country || null,
        message: "Request a call from Membership page",
        listingUrl: window.location.href
      });
      
      setIsCallModalOpen(false);
      toast.success("Call request sent!", { description: "An expert will contact you shortly." });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow pt-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-[950px] mx-auto w-full">
        {/* Step 1: Enter Information */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[#2d6a4f] text-xl font-semibold whitespace-nowrap">
              <span className="font-bold">Step 1:</span> Enter Your Information
            </h2>
            <div className="h-[1px] bg-gray-100 w-full"></div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[#334155] font-semibold text-sm">Full Name</Label>
              <Input 
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Your full name" 
                className="bg-white border-gray-100 h-14 rounded-xl focus:ring-[#2d6a4f] focus:border-[#2d6a4f] placeholder:text-gray-300" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#334155] font-semibold text-sm">Email Address</Label>
                <Input 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email address" 
                  className="bg-white border-gray-100 h-14 rounded-xl focus:ring-[#2d6a4f] focus:border-[#2d6a4f] placeholder:text-gray-300" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#334155] font-semibold text-sm">Phone Number</Label>
                <div className="flex gap-3 h-14">
                  <Select 
                    value={formData.countryCode} 
                    onValueChange={(val) => setFormData(prev => ({ ...prev, countryCode: val }))}
                  >
                    <SelectTrigger className="w-[100px] h-full bg-white border-gray-100 rounded-xl focus:ring-[#2d6a4f] focus:border-[#2d6a4f] font-bold text-gray-700">
                      <SelectValue placeholder="+1" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                      {countryCodes.map((c) => (
                        <SelectItem key={c.code} value={c.code} className="rounded-lg font-bold py-3">
                          {c.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input 
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Your phone number" 
                    className="flex-1 bg-white border-gray-100 h-full rounded-xl focus:ring-[#2d6a4f] focus:border-[#2d6a4f] placeholder:text-gray-300 font-medium" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#334155] font-semibold text-sm">Country</Label>
              <Select onValueChange={handleSelectChange} value={formData.country}>
                <SelectTrigger className="bg-white border-gray-100 h-14 rounded-xl focus:ring-[#2d6a4f] focus:border-[#2d6a4f] text-gray-400">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <div className="w-6 h-6 rounded-full border border-[#2d6a4f] flex items-center justify-center p-1">
                <Phone className="w-3 h-3 text-[#2d6a4f] fill-[#2d6a4f]/10" />
              </div>
              <button 
                type="button"
                onClick={() => setIsCallModalOpen(true)}
                className="text-[#2d6a4f] font-semibold hover:underline flex items-center gap-1 text-[15px] cursor-pointer active:scale-95 transition-all"
              >
                Request a <span className="font-bold">Call</span>
                <span className="ml-1 text-base">😊</span>
              </button>
            </div>
          </div>
        </section>

        {/* Step 2: Select Membership Plan */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[#2d6a4f] text-xl font-semibold whitespace-nowrap">
              <span className="font-bold">Step 2:</span> Select Membership Plan
            </h2>
            <div className="h-[1px] bg-gray-100 w-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative rounded-2xl border-2 p-6 flex flex-col cursor-pointer transition-all duration-300 group ${
                  selectedPlan === plan.id 
                    ? "border-[#2d6a4f]/10 bg-[#f9fbf9] shadow-inner shadow-green-900/5 ring-1 ring-[#2d6a4f]/20" 
                    : "border-gray-50 bg-[#fbfdfc] hover:border-gray-200"
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-[#cc9b52] text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-2xl rounded-tr-xl flex flex-col items-center leading-tight shadow-sm">
                      <span>Best</span>
                      <span>Value</span>
                    </div>
                  </div>
                )}
                
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-6 shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                  plan.id === "vip" ? "bg-[#1b2533]" : "bg-[#2d6a4f]"
                }`}>
                  {plan.icon}
                </div>

                <div className="mb-6">
                  <h3 className={`text-lg font-bold leading-snug ${
                    plan.id === "12-month" ? "text-[#2d6a4f]" : "text-[#1b2533]"
                  }`}>
                    {plan.name} — {plan.price}
                  </h3>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex gap-2.5 text-[14px] text-[#475569] leading-tight items-start font-medium">
                      <Check className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    selectedPlan === plan.id ? "border-[#2d6a4f]" : "border-gray-300"
                  }`}>
                    {selectedPlan === plan.id && (
                      <div className="w-2.5 h-2.5 bg-[#2d6a4f] rounded-full" />
                    )}
                  </div>
                  <span className={`text-sm font-bold transition-colors ${
                    selectedPlan === plan.id ? "text-[#1b2533]" : "text-gray-400"
                  }`}>Select this plan</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step 3: Choose Payment Method */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[#2d6a4f] text-xl font-semibold whitespace-nowrap">
              <span className="font-bold">Step 3:</span> Choose Payment Method
            </h2>
            <div className="h-[1px] bg-gray-100 w-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-gray-50 bg-white shadow-sm space-y-6">
              <button 
                onClick={() => setPaymentMethod("stripe")}
                className="w-full flex items-center gap-3 group transition-all"
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  paymentMethod === "stripe" ? "border-[#2d6a4f] bg-[#2d6a4f]" : "border-gray-200 group-hover:border-gray-300"
                }`}>
                  {paymentMethod === "stripe" && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className={`text-[15px] font-bold transition-colors ${
                  paymentMethod === "stripe" ? "text-[#1b2533]" : "text-gray-400 group-hover:text-gray-600"
                }`}>Credit Card (Stripe)</span>
              </button>

              <button 
                onClick={() => setPaymentMethod("paypal")}
                className="w-full flex items-center gap-3 group transition-all"
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  paymentMethod === "paypal" ? "border-[#2d6a4f] bg-[#2d6a4f]" : "border-gray-200 group-hover:border-gray-300"
                }`}>
                  {paymentMethod === "paypal" && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className={`text-[15px] font-bold transition-colors ${
                  paymentMethod === "paypal" ? "text-[#1b2533]" : "text-gray-400 group-hover:text-gray-600"
                }`}>PayPal</span>
              </button>

              <button 
                onClick={() => setPaymentMethod("bank")}
                className="w-full flex items-center gap-3 group transition-all"
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  paymentMethod === "bank" ? "border-[#2d6a4f] bg-[#2d6a4f]" : "border-gray-200 group-hover:border-gray-300"
                }`}>
                  {paymentMethod === "bank" && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className={`text-[15px] font-bold transition-colors ${
                  paymentMethod === "bank" ? "text-[#1b2533]" : "text-gray-400 group-hover:text-gray-600"
                }`}>Bank Transfer</span>
              </button>
            </div>

            {/* Payment Verification View (Unified for Manual Payments) */}
            <div className={`col-span-1 md:col-span-2 p-5 rounded-2xl border border-gray-50 bg-[#fbfdfc] flex flex-col min-h-[180px] shadow-sm transition-opacity duration-300 ${paymentMethod === "stripe" ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shadow-inner">
                  <Upload className="w-4 h-4 text-[#2d6a4f]" />
                </div>
                <span className="text-[15px] font-bold text-[#1b2533]">
                  {paymentMethod === "stripe" ? "Stripe Payment" : `Upload ${paymentMethod.toUpperCase()} Receipt`}
                </span>
              </div>

              {/* Payment Info Display */}
              {paymentMethod !== "stripe" && paymentDetails && (
                <div className="mb-4 bg-white/80 p-4 rounded-xl border border-emerald-100/50 space-y-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Please send payment to:</p>
                  {paymentMethod === "bank" ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <p className="text-[10px] text-slate-400">Account Name</p>
                        <p className="font-bold text-slate-800">{paymentDetails.bank.accountName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Bank Name</p>
                        <p className="font-bold text-slate-800">{paymentDetails.bank.bankName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Account Number</p>
                        <p className="font-bold text-slate-800">{paymentDetails.bank.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">SWIFT/Routing</p>
                        <p className="font-bold text-slate-800">{paymentDetails.bank.swiftCode || paymentDetails.bank.routingNumber}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[10px] text-slate-400">PayPal Email</p>
                      <p className="font-bold text-slate-800 text-lg">{paymentDetails.paypal.email}</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex-grow border-2 border-dashed border-gray-200/60 rounded-xl flex flex-col items-center justify-center gap-3 bg-white/50 group cursor-pointer hover:border-[#2d6a4f]/30 transition-all relative">
                <Input 
                  type="file" 
                  onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                
                {paymentProof ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    <span className="text-sm font-bold text-slate-700">{paymentProof.name}</span>
                    <button onClick={(e) => { e.stopPropagation(); setPaymentProof(null); }} className="text-xs text-red-500 font-bold hover:underline">Remove</button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-gray-50/80 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-1 text-[13px] font-bold text-[#1b2533]">
                      Click to upload receipt <Info className="w-3.5 h-3.5 text-gray-200" />
                    </div>
                  </>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-3 text-center">
                Please upload a clear screenshot of your payment confirmation.
              </p>
            </div>
          </div>
        </section>

        {/* Step 4: Confirm & Subscribe */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[#2d6a4f] text-xl font-semibold whitespace-nowrap">
              <span className="font-bold">Step 4:</span> Confirm & Subscribe
            </h2>
            <div className="h-[1px] bg-gray-100 w-full"></div>
          </div>

          <div className="space-y-4 mb-10">
            <div className="flex items-start gap-4 group">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
                className="mt-1 w-5 h-5 border-gray-200 rounded-md data-[state=checked]:bg-[#2d6a4f] data-[state=checked]:border-[#2d6a4f] transition-all" 
              />
              <Label htmlFor="terms" className="text-[15px] text-[#475569] font-semibold leading-relaxed">
                I agree to the <button 
                  onClick={() => setIsTermsOpen(true)}
                  className="text-[#2d6a4f] underline decoration-gray-200 underline-offset-8 transition-colors hover:decoration-[#2d6a4f] cursor-pointer"
                >Terms & Conditions</button>
              </Label>
            </div>
            <div className="flex items-start gap-4 group cursor-pointer">
              <Checkbox 
                id="sub" 
                checked={understoodNonRefundable}
                onCheckedChange={(checked) => setUnderstoodNonRefundable(!!checked)}
                className="mt-1 w-5 h-5 border-gray-200 rounded-md data-[state=checked]:bg-[#2d6a4f] data-[state=checked]:border-[#2d6a4f] transition-all" 
              />
              <Label htmlFor="sub" className="text-[15px] text-[#475569] font-semibold leading-relaxed cursor-pointer group-hover:text-[#1b2533] transition-colors">
                I understand this is a service subscription <span className="text-gray-300 font-normal ml-1">(non-refundable once started)</span>
              </Label>
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-[#2d6a4f] hover:bg-[#1b4332] text-white h-16 text-lg font-bold rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-green-900/20"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </div>
            ) : "Subscribe & Get Access"}
          </Button>
        </section>
      </main>

      <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
        <DialogContent className="max-w-[700px] max-h-[85vh] p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
          <DialogHeader className="p-8 pb-4 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center border border-green-100/50">
                <CheckCircle2 className="w-5 h-5 text-[#2d6a4f]" />
              </div>
              <DialogTitle className="text-2xl font-bold text-[#1b2533]">Terms & Conditions</DialogTitle>
            </div>
            <DialogDescription className="text-[#64748b] text-base">
              Please read these terms carefully before subscribing to our service.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[400px] px-8 py-4 bg-white/50">
            <div className="space-y-6 text-[#475569] text-sm leading-relaxed pb-8">
              <section>
                <h3 className="text-[#1b2533] font-bold text-base mb-2">1. Acceptance of Terms</h3>
                <p>By subscribing to our membership plans, you agree to be bound by these Terms and Conditions. Our service provides vehicle identification, seller contact, and negotiation support for vehicles located in the United States.</p>
              </section>

              <section>
                <h3 className="text-[#1b2533] font-bold text-base mb-2">2. Service Description</h3>
                <p>Chriss Cars acts as an intermediary. We do not own the vehicles listed. Our service includes:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Direct contact with U.S. sellers.</li>
                  <li>Vehicle availability and condition verification.</li>
                  <li>Negotiation on your behalf.</li>
                  <li>Provision of full export and transport quotes.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-[#1b2533] font-bold text-base mb-2">3. Subscription and Fees</h3>
                <p>Subscription fees are paid in advance. All fees are non-refundable once the service has started (i.e., once we have begun researching or contacting sellers on your behalf). Each plan has specific limits on custom quotes and active requests.</p>
              </section>

              <section>
                <h3 className="text-[#1b2533] font-bold text-base mb-2">4. Vehicle Transactions</h3>
                <p>The final purchase contract is between you and the vehicle seller. Chriss Cars is not responsible for the mechanical condition of the vehicle or any misrepresented information by the seller, although we provide verification services to mitigate risk.</p>
              </section>

              <section>
                <h3 className="text-[#1b2533] font-bold text-base mb-2">5. Export and Transport</h3>
                <p>Export quotes are estimates based on current rates and regulations. Final costs may vary due to third-party shipping price changes, customs duties, or documentation requirements in the destination country.</p>
              </section>
              
              <section>
                <h3 className="text-[#1b2533] font-bold text-base mb-2">6. Limitation of Liability</h3>
                <p>Chriss Cars shall not be liable for any indirect, incidental, or consequential damages arising from the use of our service or the purchase of any vehicle.</p>
              </section>
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 bg-gray-50/50 border-t border-gray-100 flex sm:justify-between items-center gap-4">
            <p className="text-xs text-[#64748b] hidden sm:block">Last updated: April 2026</p>
            <Button 
              onClick={() => setIsTermsOpen(false)}
              className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-8 h-11 rounded-xl shadow-lg shadow-green-900/10 font-bold"
            >
              I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request a Call Modal */}
      <RequestCallModal 
        isOpen={isCallModalOpen} 
        onOpenChange={setIsCallModalOpen}
        listingUrl={window.location.href}
      />

      <Footer />
    </div>
  );
};

export default Membership;
