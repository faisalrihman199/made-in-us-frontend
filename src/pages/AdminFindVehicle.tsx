import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getVehicleFindRequest, respondVehicleFindRequest, ensureRelative } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Car, CheckCircle2, Link as LinkIcon, MessageSquare, User } from "lucide-react";
import Header from "@/components/Header";
import AdminLoading from "@/components/AdminLoading";

const AdminFindVehicle = () => {
  const { id } = useParams();
  const [request, setRequest] = useState<any>(null);
  const [foundUrl, setFoundUrl] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getVehicleFindRequest(id)
        .then(setRequest)
        .catch(() => toast.error("Failed to load inquiry details"))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !foundUrl) return;

    setIsSubmitting(true);
    try {
      const relativeUrl = ensureRelative(foundUrl);
      await respondVehicleFindRequest(id, relativeUrl, adminNote);
      toast.success("Response sent to customer!");
      setRequest((prev: any) => ({ ...prev, status: "RESPONDED", foundVehicleUrl: relativeUrl, adminNote }));

    } catch (error) {
      toast.error("Failed to send response");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <AdminLoading message="Accessing vehicle inquiry data..." />;
  if (!request) return <div className="min-h-screen flex items-center justify-center">Inquiry not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-[#1b2d1d] text-white p-8">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-8 h-8 text-emerald-400" />
              <CardTitle className="text-3xl font-bold">Vehicle Inquiry Management</CardTitle>
            </div>
            <CardDescription className="text-emerald-100 text-lg opacity-90">
              Review customer's found vehicle and provide a response
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            {/* Request Summary */}
            <div className="grid grid-cols-2 gap-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Car className="w-4 h-4" /> Submitted Vehicle
                </h3>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-900">{request.title}</p>
                  <p className="text-slate-600">{request.make} ({request.year})</p>
                  {request.sellerName && (
                    <p className="text-slate-700 text-sm">
                      <span className="font-semibold">Seller:</span> {request.sellerName}
                    </p>
                  )}
                  {request.listingUrl ? (
                    <a href={request.listingUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-medium text-sm hover:underline block pt-1">
                      Original Listing URL →
                    </a>
                  ) : (
                    <p className="text-slate-400 text-sm italic">No listing URL provided</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4" /> Requester
                </h3>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-900">{request.name}</p>
                  <p className="text-slate-600">{request.email}</p>
                  <p className="text-slate-600">{request.phone || "No phone provided"}</p>
                </div>
              </div>
            </div>

            {request.status === "RESPONDED" ? (
              <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900">Response Sent</h3>
                <p className="text-emerald-700">The customer has been notified with the following URL:</p>
                <div className="bg-white p-4 rounded-xl border border-emerald-200 inline-block font-mono text-sm text-emerald-800 break-all mb-4">
                  {request.foundVehicleUrl}
                </div>
                {request.adminNote && (
                  <div className="text-left bg-white p-5 rounded-xl border border-emerald-100 max-w-md mx-auto">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Admin Note:</p>
                    <p className="text-slate-700 italic">"{request.adminNote}"</p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="foundUrl" className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-emerald-600" />
                    Verified / Found Vehicle URL
                  </Label>
                  <Input 
                    id="foundUrl"
                    value={foundUrl}
                    onChange={(e) => setFoundUrl(e.target.value)}
                    placeholder="https://made-in-us.com/cars/verified-listing-123"
                    className="h-14 bg-slate-50 border-slate-200 rounded-xl text-lg px-5 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminNote" className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    Response Message (Optional)
                  </Label>
                  <Textarea 
                    id="adminNote"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="e.g. We have verified this vehicle and confirmed availability with the seller."
                    className="min-h-[120px] bg-slate-50 border-slate-200 rounded-xl p-5 focus:ring-emerald-500"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-16 bg-[#1b2d1d] hover:bg-[#3d5449] text-white rounded-xl font-bold text-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? "Sending Response..." : "Send Verification to User"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminFindVehicle;
