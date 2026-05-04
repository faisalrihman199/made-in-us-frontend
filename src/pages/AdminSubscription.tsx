import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSubscription, updateSubscriptionStatus } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Shield, CheckCircle2, XCircle, RefreshCcw, DollarSign, User, Mail, Phone, Globe } from "lucide-react";
import Header from "@/components/Header";
import AdminLoading from "@/components/AdminLoading";

const AdminSubscription = () => {
  const { id } = useParams();
  const [sub, setSub] = useState<any>(null);
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getSubscription(id)
        .then(setSub)
        .catch(() => toast.error("Failed to load subscription details"))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleAction = async (status: string) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateSubscriptionStatus(id, status, adminNote);
      toast.success(`Subscription ${status.toLowerCase()}!`);
      setSub((prev: any) => ({ ...prev, status, adminNote }));
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <AdminLoading message="Verifying membership application..." />;
  if (!sub) return <div className="min-h-screen flex items-center justify-center">Subscription not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-[#1b2d1d] text-white p-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-emerald-400" />
              <CardTitle className="text-3xl font-bold">Membership Review</CardTitle>
            </div>
            <CardDescription className="text-emerald-100 text-lg opacity-90">
              Review and approve membership for {sub.fullName}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            {/* Status Badge */}
            <div className="flex justify-center">
               <div className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest ${
                 sub.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                 sub.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                 'bg-rose-100 text-rose-700'
               }`}>
                 Current Status: {sub.status}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Plan & Payment */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Selected Plan</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#1b2d1d]">
                       <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">{sub.planName}</p>
                      <p className="text-emerald-600 font-bold">{sub.price}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Method</h3>
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    {sub.paymentMethod.toUpperCase()}
                  </div>
                </div>

                {sub.paymentProofUrl && (
                  <div className="pt-2">
                    <a 
                      href={sub.paymentProofUrl} 
                      target="_blank" 
                      className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-md"
                    >
                      <RefreshCcw className="w-4 h-4" /> View Payment Proof
                    </a>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-400" />
                    <p className="text-slate-900 font-bold">{sub.fullName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <p className="text-slate-600 font-medium">{sub.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <p className="text-slate-600 font-medium">{sub.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <p className="text-slate-600 font-medium">{sub.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Note */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 ml-1">Admin Note / Feedback</h3>
              <Textarea 
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Optional message to be sent in the update email..."
                className="min-h-[100px] bg-white border-slate-200 rounded-2xl p-5 focus:ring-emerald-500"
              />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <Button 
                onClick={() => handleAction("ACTIVE")}
                disabled={isSubmitting || sub.status === "ACTIVE"}
                className="h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-6 h-6" /> Approve
              </Button>
              
              <Button 
                onClick={() => handleAction("RESUBMIT_PROOF")}
                disabled={isSubmitting}
                className="h-16 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-amber-900/10 flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-6 h-6" /> Resubmit Proof
              </Button>

              <Button 
                onClick={() => handleAction("REJECTED")}
                disabled={isSubmitting || sub.status === "REJECTED"}
                className="h-16 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-rose-900/10 flex items-center justify-center gap-2"
              >
                <XCircle className="w-6 h-6" /> Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSubscription;
