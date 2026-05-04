import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getShippingQuote, replyShippingQuote, ShippingQuoteData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Ship, CheckCircle2, Clock } from 'lucide-react';
import Header from '@/components/Header';
import AdminLoading from '@/components/AdminLoading';

const AdminQuote = () => {
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<(ShippingQuoteData & { id: string, status: string, quoteAmount?: string }) | null>(null);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (id) {
      getShippingQuote(id)
        .then(setQuote)
        .catch(err => toast.error("Failed to load request details"));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !amount) return;
    setIsSubmitting(true);
    try {
      await replyShippingQuote(id, amount);
      toast.success("Quote sent to customer!");
      setIsDone(true);
    } catch (error) {
      toast.error("Failed to send quote");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white p-12 rounded-[2rem] shadow-xl text-center max-w-md w-full border border-emerald-100">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Quote Sent!</h2>
            <p className="text-slate-600 mb-8">The customer has been notified via email with your shipping quote of <span className="font-bold text-emerald-700">${amount}</span>.</p>
            <Button onClick={() => window.location.href = '/'} className="bg-[#107050] hover:bg-[#0c5940] w-full h-12 rounded-xl font-bold">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) return <AdminLoading message="Loading shipping quote details..." />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 py-12 px-4 md:py-20">
        <div className="max-w-[800px] mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-[#107050] p-10 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Ship className="w-40 h-40" />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                   <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">Admin Panel</div>
                   {quote.status === 'SENT' && <div className="px-3 py-1 bg-blue-500 rounded-full text-xs font-bold uppercase tracking-wider">Already Sent: ${quote.quoteAmount}</div>}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Shipping Quote Reply</h1>
                <p className="text-emerald-100/80 font-medium">Provide a shipping quote for {quote.firstName} {quote.lastName}</p>
             </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Customer Details</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-slate-400">Name</Label>
                    <p className="text-lg font-bold text-slate-900">{quote.firstName} {quote.lastName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-400">Destination</Label>
                    <p className="text-lg font-bold text-slate-900">{quote.destination}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-400">Contact</Label>
                    <p className="text-slate-600 font-medium">{quote.email}</p>
                    <p className="text-slate-600 font-medium">{quote.phone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Vehicle Details</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-slate-400">Vehicle</Label>
                    <p className="text-lg font-bold text-slate-900">{quote.vehicleYear} {quote.vehicleMake} {quote.vehicleModel}</p>
                  </div>
                  {quote.message && (
                    <div>
                      <Label className="text-xs text-slate-400">Customer Message</Label>
                      <p className="text-slate-600 italic bg-slate-50 p-4 rounded-xl border border-slate-100">"{quote.message}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100">
               <div className="max-w-md mx-auto space-y-6">
                  <div className="text-center space-y-2 mb-4">
                     <h3 className="text-2xl font-bold text-[#107050]">Submit Quote</h3>
                     <p className="text-slate-500 text-sm">Enter the estimated total shipping amount in USD.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm font-bold text-slate-700 ml-1">Quote Amount (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">$</span>
                      <Input 
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-16 pl-10 text-3xl font-bold rounded-2xl border-emerald-100 focus:border-[#107050] focus:ring-[#107050]/10 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-16 bg-[#107050] hover:bg-[#0c5940] text-white text-xl font-bold rounded-2xl shadow-xl shadow-emerald-900/20 transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? "Sending..." : "Send Quote to User"}
                  </Button>
               </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminQuote;
