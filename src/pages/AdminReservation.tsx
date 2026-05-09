import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getVehicleReservation, confirmVehicleReservation, formatUrl, ensureRelative } from "@/lib/api";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Car, CheckCircle2, Link as LinkIcon, DollarSign } from "lucide-react";
import Header from "@/components/Header";
import AdminLoading from "@/components/AdminLoading";

const AdminReservation = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState<any>(null);
  const [vehicleUrl, setVehicleUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getVehicleReservation(id)
        .then(setReservation)
        .catch(() => toast.error("Failed to load reservation details"))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !vehicleUrl) return;

    setIsSubmitting(true);
    try {
      const relativeUrl = ensureRelative(vehicleUrl);
      await confirmVehicleReservation(id, relativeUrl);
      toast.success("Reservation confirmed and user notified!");
      setReservation((prev: any) => ({ ...prev, status: "RESERVED", reservedVehicleUrl: relativeUrl }));

    } catch (error) {
      toast.error("Failed to confirm reservation");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <AdminLoading message="Accessing secure reservation data..." />;
  if (!reservation) return <div className="min-h-screen flex items-center justify-center">Reservation not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-[#1b2d1d] text-white p-8">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-8 h-8 text-emerald-400" />
              <CardTitle className="text-3xl font-bold">Reservation Management</CardTitle>
            </div>
            <CardDescription className="text-emerald-100 text-lg opacity-90">
              Confirm deposit and send vehicle URL for {reservation.firstName}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            {/* Request Summary */}
            <div className="grid grid-cols-2 gap-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Desired Vehicle</h3>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-900">{reservation.vehicleMake} {reservation.vehicleModel}</p>
                  <p className="text-slate-600">Year: {reservation.vehicleYear || "Any"}</p>
                  <p className="text-slate-600 font-medium">Budget: {reservation.budget || "N/A"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Customer Details</h3>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-900">{reservation.firstName} {reservation.lastName}</p>
                  <p className="text-slate-600">{reservation.email}</p>
                  <p className="text-slate-600">{reservation.phone}</p>
                </div>
              </div>
            </div>

            {/* Payment Proof Preview */}
            {reservation.paymentProofUrl && (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                  <span className="font-bold text-emerald-900">Deposit Proof Received</span>
                </div>
                <a 
                  href={formatUrl(reservation.paymentProofUrl)} 
                  target="_blank" 
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors"
                >
                  View Receipt
                </a>

              </div>
            )}

            {reservation.status === "RESERVED" ? (
              <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900">Reservation Confirmed</h3>
                <p className="text-emerald-700">The vehicle URL has been sent to the customer.</p>
                <div className="bg-white p-4 rounded-xl border border-emerald-200 inline-block font-mono text-sm text-emerald-800 break-all">
                  {reservation.reservedVehicleUrl}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicleUrl" className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-emerald-600" />
                    Reserved Vehicle URL
                  </Label>
                  <Input 
                    id="vehicleUrl"
                    value={vehicleUrl}
                    onChange={(e) => setVehicleUrl(e.target.value)}
                    placeholder="https://made-in-us.com/cars/reserved-listing-123"
                    className="h-14 bg-slate-50 border-slate-200 rounded-xl text-lg px-5 focus:ring-emerald-500"
                    required
                  />
                  <p className="text-sm text-slate-500 ml-1">
                    Paste the URL of the vehicle listing you have secured for this customer.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="h-16 bg-[#1b2d1d] hover:bg-[#3d5449] text-white rounded-xl font-bold text-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? "Confirming..." : "Confirm & Send URL"}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      if (!id) return;
                      setIsSubmitting(true);
                      try {
                        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/vehicle-reservations/${id}/status`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'RESUBMIT_PROOF', adminNote: 'Please provide a clearer proof of payment.' }),
                        });
                        toast.success("Request sent to user!");
                        setReservation((prev: any) => ({ ...prev, status: 'RESUBMIT_PROOF' }));
                      } catch (e) {
                        toast.error("Failed to send request");
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    disabled={isSubmitting}
                    className="h-16 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 rounded-xl font-bold text-xl transition-all"
                  >
                    Request Resubmit
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReservation;
