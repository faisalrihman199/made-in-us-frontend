import React, { useState, useEffect } from "react";
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
import {
  Check,
  ShieldCheck,
  Clock,
  CreditCard,
  Landmark,
  FileText,
  HandCoins,
  Car,
  Calendar,
  Info,
  Lock,
  CheckCircle2,
  CalendarDays,
  Headset,
  PhoneCall,
  Handshake,
  UserCheck,
  Loader2
} from "lucide-react";


import { submitVehicleReservation, getPaymentDetails } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const INSPECTION_PRICE = 500;
const RESERVATION_PRICE = 1000;

const ReserveVehicle = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer">("card");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  // Service Selection
  const [selectedServices, setSelectedServices] = useState({
    inspection: true,
    reservation: true,
  });

  // Vehicle Information
  const [vehicleInfo, setVehicleInfo] = useState({
    make: "",
    year: "",
    model: "",
    vin: "",
    licensePlate: "",
  });

  // Card Details (UI state only for now)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    email: "",
    phone: "",
  });


  useEffect(() => {
    getPaymentDetails().then(setPaymentDetails).catch(console.error);
  }, []);

  const total = (selectedServices.inspection ? INSPECTION_PRICE : 0) +
    (selectedServices.reservation ? RESERVATION_PRICE : 0);

  const toggleService = (service: "inspection" | "reservation") => {
    setSelectedServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const handleVehicleChange = (name: string, value: string) => {
    setVehicleInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedServices.inspection && !selectedServices.reservation) {
      toast.error("No service selected", {
        description: "Please select at least one service to proceed."
      });
      return;
    }

    if (!vehicleInfo.make || !vehicleInfo.model || !vehicleInfo.vin) {
      toast.error("Vehicle information missing", {
        description: "Please provide the Make, Model, and VIN of the vehicle."
      });
      return;
    }

    if (paymentMethod === "transfer" && !paymentProof) {
      toast.error("Payment proof required", {
        description: "Please upload a receipt for the bank transfer."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSend = {
        firstName: cardDetails.name.split(" ")[0] || "User",
        lastName: cardDetails.name.split(" ").slice(1).join(" ") || "Reserved",
        email: cardDetails.email || "user@example.com",
        phone: cardDetails.phone || "",
        vehicleMake: vehicleInfo.make,
        vehicleModel: vehicleInfo.model,
        vehicleYear: vehicleInfo.year,
        notes: `Services: ${selectedServices.inspection ? "Inspection " : ""}${selectedServices.reservation ? "Reservation" : ""}. VIN: ${vehicleInfo.vin}.`,
      };

      // @ts-ignore
      await submitVehicleReservation(dataToSend, paymentProof || new File([], "dummy.txt"));
      navigate("/confirmation");
    } catch (error) {
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const years = Array.from({ length: 30 }, (_, i) => (2025 - i).toString());
  const makes = ["Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", "Audi", "Tesla", "Lexus", "Nissan"];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#1b2533]">
      <Header />

      <main className="max-w-[1000px] mx-auto px-4 pt-6 pb-20">
        {/* Main Header Container */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#2f884d] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#2f884d]/20">
              <HandCoins className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Payment</h1>
              <p className="text-gray-500 text-sm font-medium">Select the service(s) you would like to pay for and choose your payment method.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-50 rounded-2xl border border-gray-100 mt-4 md:mt-0">
            <ShieldCheck className="w-6 h-6 text-[#2f884d]" />
            <div>
              <p className="text-[13px] font-bold">Secure Payment</p>
              <p className="text-[11px] text-gray-500 font-medium">Your data is encrypted and protected.</p>
            </div>
          </div>
        </div>

        {/* Section: Choose Service */}
        <div className="mb-10">
          <h2 className="text-[19px] font-bold mb-6">Choose the service(s) you would like to pay for</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Inspection Card */}
            <div
              onClick={() => toggleService("inspection")}
              className={`relative p-8 rounded-xl border-2 transition-all cursor-pointer bg-white ${selectedServices.inspection ? "border-[#2f884d]" : "border-gray-100 hover:border-gray-200"
                }`}
            >
              <div className={`absolute top-4 left-4 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${selectedServices.inspection ? "bg-[#2f884d] border-[#2f884d]" : "border-gray-200"
                }`}>
                {selectedServices.inspection && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </div>
              <div className="flex flex-col items-center text-center gap-4 mt-2">
                <Car className={`w-14 h-14 ${selectedServices.inspection ? "text-[#1b2533]" : "text-gray-300"}`} strokeWidth={1.5} />
                <div className="text-left w-full">
                  <h3 className="font-bold text-[17px] mb-1">Vehicle Inspection</h3>
                  <p className="text-gray-400 text-[13px] font-medium leading-tight mb-4">Complete vehicle inspection report by a certified inspector.</p>
                  <p className="text-[19px] font-bold text-[#2f884d]">${INSPECTION_PRICE.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Reservation Card */}
            <div
              onClick={() => toggleService("reservation")}
              className={`relative p-8 rounded-xl border-2 transition-all cursor-pointer bg-white ${selectedServices.reservation ? "border-[#2f884d]" : "border-gray-100 hover:border-gray-200"
                }`}
            >
              <div className={`absolute top-4 left-4 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${selectedServices.reservation ? "bg-[#2f884d] border-[#2f884d]" : "border-gray-200"
                }`}>
                {selectedServices.reservation && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </div>
              <div className="flex flex-col items-center text-center gap-4 mt-2">
                <CalendarDays className={`w-14 h-14 ${selectedServices.reservation ? "text-[#1b2533]" : "text-gray-300"}`} strokeWidth={1.5} />
                <div className="text-left w-full">
                  <h3 className="font-bold text-[17px] mb-1">Vehicle Reservation</h3>
                  <p className="text-gray-400 text-[13px] font-medium leading-tight mb-4">Reserve the vehicle and hold it before the sale.</p>
                  <p className="text-[19px] font-bold text-[#2f884d]">${RESERVATION_PRICE.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Separator with Info */}
          <div className="relative flex items-center justify-center py-4">
            <div className="absolute w-full h-[1px] bg-gray-100" />
            <div className="relative bg-[#FAFAFA] px-4 flex items-center gap-2 text-gray-500 text-[13px] font-medium">
              <Info className="w-4 h-4 text-[#2f884d]" />
              You may select one service or both.
            </div>
          </div>
        </div>

        {/* Section: Vehicle Info */}
        <section className="mb-10">
          <h2 className="text-[19px] font-bold mb-6">Vehicle information</h2>
          <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <Label className="text-[13px] font-bold">Make (Brand)</Label>
                <Input 
                  placeholder="Enter make (e.g. Ford)" 
                  className="h-12 rounded-lg border-gray-100"
                  onChange={(e) => handleVehicleChange("make", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold">Year</Label>
                <Input 
                  placeholder="Enter year (e.g. 2024)" 
                  type="number"
                  className="h-12 rounded-lg border-gray-100"
                  onChange={(e) => handleVehicleChange("year", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold">Model</Label>
                <Input 
                  placeholder="Enter model (e.g. Mustang)" 
                  className="h-12 rounded-lg border-gray-100"
                  onChange={(e) => handleVehicleChange("model", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[13px] font-bold">VIN (Serial Number)</Label>
                <div className="relative">
                  <Input
                    placeholder="Enter VIN (17 characters)"
                    className="h-12 pr-10 rounded-lg border-gray-100"
                    onChange={(e) => handleVehicleChange("vin", e.target.value)}
                  />
                  <Info className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold">License Plate (Optional)</Label>
                <Input
                  placeholder="Enter license plate"
                  className="h-12 rounded-lg border-gray-100"
                  onChange={(e) => handleVehicleChange("licensePlate", e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section: Payment Method Selection */}
        <section className="mb-10">
          <h2 className="text-[19px] font-bold mb-6">Choose your payment method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setPaymentMethod("card")}
              className={`p-8 rounded-xl border-2 transition-all cursor-pointer bg-white flex flex-col gap-4 ${paymentMethod === "card" ? "border-[#2f884d]" : "border-gray-100 hover:border-gray-200"
                }`}
            >
              <div className="flex justify-between items-start">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === "card" ? "border-[#2f884d]" : "border-gray-200"
                  }`}>
                  {paymentMethod === "card" && <div className="w-3 h-3 rounded-full bg-[#2f884d]" />}
                </div>
                <CreditCard className={`w-10 h-10 ${paymentMethod === "card" ? "text-[#1b2533]" : "text-gray-300"}`} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-[17px] mb-1">Credit / Debit Card (Stripe)</h4>
                <p className="text-gray-400 text-[13px] font-medium leading-relaxed mb-5">Secure payment by credit or debit card via Stripe.</p>
                <div className="flex gap-2">
                  <div className="h-7 w-12 bg-gray-50 border border-gray-100 rounded flex items-center justify-center">
                    <span className="text-[10px] font-black italic text-blue-800 tracking-tighter">VISA</span>
                  </div>
                  <div className="h-7 w-12 bg-gray-50 border border-gray-100 rounded flex items-center justify-center">
                    <div className="flex -space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500 opacity-90" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-90" />
                    </div>
                  </div>
                  <div className="h-7 w-12 bg-gray-50 border border-gray-100 rounded flex items-center justify-center">
                    <div className="bg-[#0070d1] text-white text-[8px] font-bold px-1 rounded-sm">AMEX</div>
                  </div>
                  <div className="h-7 w-12 bg-black rounded flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold"> Pay</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              onClick={() => setPaymentMethod("transfer")}
              className={`p-8 rounded-xl border-2 transition-all cursor-pointer bg-white flex flex-col gap-4 ${paymentMethod === "transfer" ? "border-[#2f884d]" : "border-gray-100 hover:border-gray-200"
                }`}
            >
              <div className="flex justify-between items-start">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === "transfer" ? "border-[#2f884d]" : "border-gray-200"
                  }`}>
                  {paymentMethod === "transfer" && <div className="w-3 h-3 rounded-full bg-[#2f884d]" />}
                </div>
                <Landmark className={`w-10 h-10 ${paymentMethod === "transfer" ? "text-[#1b2533]" : "text-gray-300"}`} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-[17px] mb-1">Bank Transfer</h4>
                <p className="text-gray-400 text-[13px] font-medium leading-relaxed">Make a bank transfer directly from your bank account.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Payment Details & Order Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-2">
            <section className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm h-full">
              {paymentMethod === "card" ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[17px]">Pay with credit or debit card</h4>
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-400 font-bold">
                      <Lock className="w-3.5 h-3.5" /> Secured by Stripe
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold">Card information</Label>
                      <div className="relative">
                        <Input
                          placeholder="Card number"
                          className="h-12 pr-24 rounded-lg border-gray-100"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                          <span className="text-[8px] font-black italic text-blue-800 opacity-50">VISA</span>
                          <div className="flex -space-x-1 opacity-50">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                          </div>
                          <div className="bg-[#0070d1] text-white text-[7px] font-bold px-0.5 rounded-sm opacity-50">AMEX</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[13px] font-bold">Expiration date</Label>
                        <Input placeholder="MM / YY" className="h-12 rounded-lg border-gray-100" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[13px] font-bold">CVC</Label>
                        <div className="relative">
                          <Input placeholder="CVC" className="h-12 rounded-lg border-gray-100" />
                          <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-200" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold">Name on card</Label>
                      <Input name="name" placeholder="Full name" className="h-12 rounded-lg border-gray-100" onChange={handleCardChange} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[13px] font-bold">Email Address</Label>
                        <Input name="email" placeholder="email@example.com" className="h-12 rounded-lg border-gray-100" onChange={handleCardChange} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[13px] font-bold">Phone Number</Label>
                        <Input name="phone" placeholder="+1 (555) 000-0000" className="h-12 rounded-lg border-gray-100" onChange={handleCardChange} />
                      </div>
                    </div>


                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full h-14 bg-[#215a36] hover:bg-[#1a4a2c] text-white rounded-lg font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-green-900/10 transition-all active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Pay ${total.toLocaleString()}
                        </>
                      )}
                    </Button>


                    <div className="flex items-center justify-center gap-2 text-[12px] text-gray-400 font-bold">
                      <ShieldCheck className="w-4 h-4 text-[#2f884d]" /> Your payment is 100% secure. No card information is stored.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h4 className="font-bold text-[17px]">Transfer details</h4>
                  {paymentDetails && (
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                      <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                        <span className="text-[13px] text-gray-500 font-bold">Bank Name</span>
                        <span className="font-bold">{paymentDetails.bank.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                        <span className="text-[13px] text-gray-500 font-bold">Account Name</span>
                        <span className="font-bold">{paymentDetails.bank.accountName}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                        <span className="text-[13px] text-gray-500 font-bold">Account Number</span>
                        <span className="font-bold">{paymentDetails.bank.accountNumber}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-gray-500 font-bold">SWIFT / Routing</span>
                        <span className="font-bold">{paymentDetails.bank.swiftCode || paymentDetails.bank.routingNumber}</span>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold">Full Name</Label>
                      <Input name="name" placeholder="John Doe" className="h-12 rounded-lg border-gray-100" onChange={handleCardChange} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold">Email Address</Label>
                      <Input name="email" placeholder="email@example.com" className="h-12 rounded-lg border-gray-100" onChange={handleCardChange} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold">Phone Number</Label>
                      <Input name="phone" placeholder="+1 (555) 000-0000" className="h-12 rounded-lg border-gray-100" onChange={handleCardChange} />
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Label className="text-[13px] font-bold">Upload Transfer Proof</Label>
                    <Input
                      type="file"
                      onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                      className="h-14 bg-white border-gray-100 rounded-lg py-3.5 cursor-pointer"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#2f884d] hover:bg-[#25733f] text-white rounded-lg font-bold text-lg flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Reservation Request"
                    )}
                  </Button>

                </div>
              )}
            </section>
          </div>

          {/* Right Column: Order Summary & Delivery */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
              <h4 className="font-bold text-[#2f884d] text-[17px] mb-8">Order Summary</h4>
              <div className="space-y-5 mb-8">
                {selectedServices.inspection && (
                  <div className="flex justify-between text-[14px]">
                    <span className="text-gray-800 font-medium">Vehicle Inspection</span>
                    <span className="font-bold">${INSPECTION_PRICE.toFixed(2)}</span>
                  </div>
                )}
                {selectedServices.reservation && (
                  <div className="flex justify-between text-[14px]">
                    <span className="text-gray-800 font-medium">Vehicle Reservation</span>
                    <span className="font-bold">${RESERVATION_PRICE.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[19px] font-bold">Total</span>
                <span className="text-[24px] font-black text-[#2f884d]">${total.toLocaleString()}</span>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f0f9f3] rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#2f884d]" />
                </div>
                <h4 className="font-bold text-[16px]">Estimated delivery time</h4>
              </div>
              <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
                You will receive the complete inspection report and vehicle photos within 3 to 5 business days, depending on the inspector's availability.
              </p>
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#2f884d] pt-2">
                <Calendar className="w-4 h-4" /> Estimated time: 3 to 5 days
              </div>
            </div>
          </div>
        </div>

        {/* Section: Process Explanation (Redesigned from Image 2) */}
        <section className="bg-white border-2 border-[#2f884d] rounded-[32px] p-8 md:p-12 shadow-sm relative overflow-hidden">
          {/* Decorative background elements */}


          {/* Top Illustration Area */}
          <div className="flex flex-col items-center justify-center mb-8 relative">
            <div className="relative">
              {/* Agent Avatar Circle */}
              <div className="w-32 h-32 rounded-full border-2 border-gray-100 flex items-center justify-center bg-gray-50/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#2f884d]/5" />
                <Headset className="w-16 h-16 text-[#2f884d]" strokeWidth={1.5} />
              </div>
              {/* Overlapping Shield */}
              <div className="absolute bottom-2 -right-4 w-12 h-14 bg-white rounded-xl shadow-lg border border-gray-50 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#2f884d]" />
              </div>

            </div>
          </div>

          {/* Title Area */}
          <div className="flex items-center gap-6 mb-8">
            <div className="flex-1 h-[2px] bg-gray-100 hidden sm:block" />
            <h3 className="text-center text-2xl md:text-3xl font-black text-[#1b2d1d] tracking-tight">
              Thank you for your reservation request!
            </h3>
            <div className="flex-1 h-[2px] bg-gray-100 hidden sm:block" />
          </div>

          {/* Procedural Explanation Grid */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            {/* Left Icon */}
            <div className="hidden lg:flex w-20 h-20 rounded-full border-2 border-gray-100 items-center justify-center text-gray-400">
              <PhoneCall className="w-10 h-10" strokeWidth={1} />
            </div>

            <div className="flex-1 text-center max-w-[600px] space-y-4">
              <div className="w-2 h-2 bg-[#2f884d] rounded-full mx-auto" />
              <p className="text-lg md:text-xl font-bold text-[#1b2d1d] leading-relaxed">
                One of our agents will contact you during the day,
                and we will contact the seller to proceed with
                the vehicle reservation <span className="text-[#2f884d]">and confirm your order</span> at the same time.
              </p>
            </div>

            {/* Right Icon */}
            <div className="hidden lg:flex w-20 h-20 rounded-full border-2 border-gray-100 items-center justify-center text-gray-400">
              <Handshake className="w-10 h-10" strokeWidth={1} />
            </div>
          </div>

          {/* Footer Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-[24px] border border-gray-100">
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-full bg-[#2f884d] flex items-center justify-center text-white shadow-lg shadow-[#2f884d]/20 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-black text-[#2f884d] leading-none mb-1">We'll contact you</span>
                <span className="text-[12px] text-gray-500 font-bold">during the day</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border-y md:border-y-0 md:border-x border-gray-200/50">
              <div className="w-12 h-12 rounded-full bg-[#2f884d] flex items-center justify-center text-white shadow-lg shadow-[#2f884d]/20 shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-black text-[#2f884d] leading-none mb-1">We will contact</span>
                <span className="text-[12px] text-gray-500 font-bold">the seller</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-full bg-[#2f884d] flex items-center justify-center text-white shadow-lg shadow-[#2f884d]/20 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-black text-[#2f884d] leading-none mb-1">We will confirm</span>
                <span className="text-[12px] text-gray-500 font-bold">your order at the same time</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ReserveVehicle;


