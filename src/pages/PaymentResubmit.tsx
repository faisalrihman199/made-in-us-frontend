import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPaymentDetails, resubmitPayment } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, CheckCircle2, Loader2, DollarSign, Info, AlertCircle, Copy } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const PaymentResubmit = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getPaymentDetails()
      .then(setPaymentDetails)
      .catch(() => toast.error("Failed to load payment details"))
      .finally(() => setIsLoaded(true));
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !id || !file) return;

    setIsSubmitting(true);
    try {
      await resubmitPayment(type as any, id, file);
      navigate("/confirmation");
    } catch (error) {
      toast.error("Failed to resubmit payment proof");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <Loader2 className="w-10 h-10 animate-spin text-[#2d6a4f]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-10 space-y-3">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Resubmit Payment Proof</h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Please review the payment details below and upload a clear screenshot of your transaction for your <span className="font-bold text-slate-700 capitalize">{type}</span> request.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment Details Card */}
          <div className="space-y-6">
             <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <CardTitle className="text-xl">Bank Transfer Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[
                    { label: "Account Name", value: paymentDetails?.bank.accountName },
                    { label: "Bank Name", value: paymentDetails?.bank.bankName },
                    { label: "Account Number", value: paymentDetails?.bank.accountNumber },
                    { label: "Routing Number", value: paymentDetails?.bank.routingNumber },
                    { label: "SWIFT Code", value: paymentDetails?.bank.swiftCode },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center group">
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                        <p className="text-[15px] font-bold text-slate-800">{item.value}</p>
                      </div>
                      <button 
                        onClick={() => handleCopy(item.value)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </CardContent>
             </Card>

             <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-[#0070ba] text-white p-6">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    <CardTitle className="text-xl">PayPal Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-slate-100/60 uppercase tracking-wider">PayPal Email</p>
                    <p className="text-lg font-bold text-slate-900">{paymentDetails?.paypal.email}</p>
                  </div>
                  <button 
                    onClick={() => handleCopy(paymentDetails?.paypal.email)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </CardContent>
             </Card>
          </div>

          {/* Resubmit Form Card */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-8">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">Upload New Receipt</h3>
                  <p className="text-sm text-slate-500 italic">Please ensure all details are visible</p>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-300 transition-all cursor-pointer relative group">
                  <Input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                  
                  {file ? (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                         <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 break-all px-4">{file.name}</p>
                        <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-7 h-7 text-slate-400 group-hover:text-emerald-500" />
                      </div>
                      <span className="font-bold text-slate-600 group-hover:text-emerald-600">Click to upload file</span>
                    </>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !file}
                  className="w-full h-16 bg-[#1b2d1d] hover:bg-[#3d5449] text-white rounded-2xl font-bold text-xl shadow-lg shadow-emerald-900/10 transition-all active:scale-[0.95]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Uploading...
                    </div>
                  ) : "Submit Payment Proof"}
                </Button>

                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  By submitting, you confirm that the provided proof matches your transaction. 
                  Our team will verify the payment within 1-2 business hours.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentResubmit;
