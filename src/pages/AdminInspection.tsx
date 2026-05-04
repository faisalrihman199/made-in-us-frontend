import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getVehicleInspection, submitInspectionReport } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, FileText, CheckCircle2, DollarSign } from "lucide-react";
import Header from "@/components/Header";
import AdminLoading from "@/components/AdminLoading";

const AdminInspection = () => {
  const { id } = useParams();
  const [inspection, setInspection] = useState<any>(null);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getVehicleInspection(id)
        .then(setInspection)
        .catch(() => toast.error("Failed to load inspection details"))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !reportFile) return;

    setIsSubmitting(true);
    try {
      const { reportUrl } = await submitInspectionReport(id, reportFile);
      toast.success("Inspection report uploaded and sent to user!");
      setInspection((prev: any) => ({ ...prev, status: "COMPLETED", reportUrl }));
    } catch (error) {
      toast.error("Failed to upload report");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <AdminLoading message="Retrieving vehicle inspection details..." />;
  if (!inspection) return <div className="min-h-screen flex items-center justify-center">Inspection not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-[#1b2d1d] text-white p-8">
            <div className="flex items-center gap-3 mb-2">
              <Search className="w-8 h-8 text-emerald-400" />
              <CardTitle className="text-3xl font-bold">Inspection Management</CardTitle>
            </div>
            <CardDescription className="text-emerald-100 text-lg opacity-90">
              Upload the professional inspection report for {inspection.make}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            {/* Request Summary */}
            <div className="grid grid-cols-2 gap-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Vehicle Details</h3>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-900">{inspection.make}</p>
                  <p className="text-slate-600 font-mono text-sm">VIN: {inspection.vin}</p>
                  <a href={inspection.listingUrl} target="_blank" className="text-emerald-600 text-sm hover:underline flex items-center gap-1">
                    View Listing Link →
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Customer Details</h3>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-slate-900">{inspection.firstName} {inspection.lastName}</p>
                  <p className="text-slate-600">{inspection.email}</p>
                  <p className="text-slate-600">{inspection.phone}</p>
                </div>
              </div>
            </div>

            {/* Payment Proof Preview */}
            {inspection.paymentProofUrl && (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                  <span className="font-bold text-emerald-900">Inspection Fee Proof Received</span>
                </div>
                <a 
                  href={inspection.paymentProofUrl} 
                  target="_blank" 
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors"
                >
                  View Receipt
                </a>
              </div>
            )}

            {inspection.status === "COMPLETED" ? (
              <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900">Report Already Sent</h3>
                <p className="text-emerald-700">The report has been uploaded and delivered to the customer.</p>
                <div className="bg-white p-4 rounded-xl border border-emerald-200 inline-block font-mono text-xs text-emerald-800 break-all max-w-full">
                  {inspection.reportUrl}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reportFile" className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    Inspection Report File (PDF, Images, ZIP)
                  </Label>
                  <Input 
                    id="reportFile"
                    type="file"
                    onChange={(e) => setReportFile(e.target.files?.[0] || null)}
                    className="h-14 bg-slate-50 border-slate-200 rounded-xl text-lg px-5 py-3 focus:ring-emerald-500 cursor-pointer"
                    required
                    accept=".pdf,.jpg,.jpeg,.png,.zip"
                  />
                  <p className="text-sm text-slate-500 ml-1">
                    Select the inspection report file to upload and send to the customer.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !reportFile}
                    className="h-16 bg-[#1b2d1d] hover:bg-[#3d5449] text-white rounded-xl font-bold text-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? "Uploading Report..." : "Upload & Send Report"}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      if (!id) return;
                      setIsSubmitting(true);
                      try {
                        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/vehicle-inspections/${id}/status`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'RESUBMIT_PROOF', adminNote: 'Please provide a clearer proof of payment.' }),
                        });
                        toast.success("Request sent to user!");
                        setInspection((prev: any) => ({ ...prev, status: 'RESUBMIT_PROOF' }));
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

export default AdminInspection;
