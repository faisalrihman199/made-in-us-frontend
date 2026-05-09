import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Edit, Trash, Star, Upload, FileSpreadsheet, User, MapPin, Car, X, ShieldCheck, Check, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export default function ReviewManagementTab() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentReview, setCurrentReview] = useState<any>(null);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [forceLive, setForceLive] = useState(false);
  const [showManageUploads, setShowManageUploads] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [totalRows, setTotalRows] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'single' | 'batch', id: string, count?: number } | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: result, isLoading } = useQuery({
    queryKey: ["admin-reviews", search, filterStatus, filterRating, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
      });
      if (filterStatus !== "all") params.append("isApproved", filterStatus === "approved" ? "true" : "false");
      if (filterRating !== "all") params.append("rating", filterRating);
      
      const res = await fetch(`${API_BASE}/api/reviews?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    }
  });

  const reviews = result?.reviews || [];
  const totalPages = result?.totalPages || 1;

  const { data: batchList, isLoading: batchesLoading } = useQuery({
    queryKey: ["review-batches"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/reviews/batches`);
      if (!res.ok) throw new Error("Failed to fetch batches");
      return res.json();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE}/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review deleted successfully");
    }
  });

  const deleteBatchMutation = useMutation({
    mutationFn: async (batchId: string) => {
      const res = await fetch(`${API_BASE}/api/reviews/batch/${batchId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete batch");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review-batches"] });
      toast.success(`Deleted batch: ${data.count} reviews removed`);
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      const method = reviewData.id ? "PUT" : "POST";
      const url = reviewData.id ? `${API_BASE}/api/reviews/${reviewData.id}` : `${API_BASE}/api/reviews`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData)
      });
      if (!res.ok) throw new Error("Failed to save review");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Testimonial saved successfully");
      setIsEditing(false);
      setCurrentReview(null);
      setImagePreview(null);
    }
  });

  const handleFileSelect = (file: File | null) => {
    setBulkFile(file);
    setTotalRows(null);
    if (!file) return;

    const reader = new FileReader();
    const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
    
    reader.onload = (e) => {
      try {
        if (isExcel) {
          const ab = e.target?.result as ArrayBuffer;
          const wb = XLSX.read(ab, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
          setTotalRows(Math.max(0, rows.length - 1));
        } else {
          const text = e.target?.result as string;
          const rows = text.split("\n").filter(r => r.trim());
          setTotalRows(Math.max(0, rows.length - 1));
        }
      } catch (err) {
        console.error("Error counting rows:", err);
      }
    };

    if (isExcel) reader.readAsArrayBuffer(file);
    else reader.readAsText(file);
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) {
      toast.error("Please select a file to upload");
      return;
    }
    
    setIsBulkProcessing(true);
    setBulkProgress(10);
    const reader = new FileReader();
    const isExcel = bulkFile.name.endsWith(".xlsx") || bulkFile.name.endsWith(".xls");
    
    reader.onload = async (e) => {
      try {
        let data = [];
        setBulkProgress(30);
        
        if (isExcel) {
          const ab = e.target?.result as ArrayBuffer;
          const wb = XLSX.read(ab, { type: "array" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const rows: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
          
          if (rows.length < 2) throw new Error("Invalid Excel format");
          
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;
            
            // Smart rating parsing (handles "★★★★★", "5", etc)
            const rawRating = String(row[5] || "");
            const starCount = (rawRating.match(/[★⭐]/g) || []).length;
            const parsedRating = starCount > 0 ? starCount : (parseInt(rawRating) || 5);

            data.push({
              language: row[0] || "English",
              country: row[1],
              city: row[2],
              authorName: row[3] || "Anonymous",
              vehicle: row[4],
              rating: Math.min(5, Math.max(1, parsedRating)),
              content: row[6],
              authorImageUrl: row[7],
              isApproved: forceLive ? true : (String(row[8]).toLowerCase() === "true" || row[8] === 1)
            });
          }
        } else {
          const text = e.target?.result as string;
          const rows = text.split("\n");
          if (rows.length < 2) throw new Error("Invalid CSV format");
          
          for (let i = 1; i < rows.length; i++) {
            if (!rows[i].trim()) continue;
            const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
            const cols = rows[i].split(regex).map(val => val.replace(/^"|"$/g, '').trim());
            
            if (cols.length >= 7) {
              const rawRating = cols[5] || "";
              const starCount = (rawRating.match(/[★⭐]/g) || []).length;
              const parsedRating = starCount > 0 ? starCount : (parseInt(rawRating) || 5);

              data.push({
                language: cols[0] || "English",
                country: cols[1],
                city: cols[2],
                authorName: cols[3],
                vehicle: cols[4],
                rating: Math.min(5, Math.max(1, parsedRating)),
                content: cols[6],
                authorImageUrl: cols[7],
                isApproved: forceLive ? true : (cols[8] === "true" || cols[8] === "1" || cols[8] === "TRUE")
              });
            }
          }
        }

        setBulkProgress(60);
        const batchId = `batch_${Date.now()}_${bulkFile.name}`;
        const res = await fetch(`${API_BASE}/api/reviews/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviews: data, batchId })
        });
        
        if (!res.ok) throw new Error("Failed to upload bulk reviews");
        
        setBulkProgress(100);
        toast.success(`Successfully uploaded ${data.length} reviews`);
        queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
        queryClient.invalidateQueries({ queryKey: ["review-batches"] });
        setBulkFile(null);
        setTotalRows(null);
        const fileInput = document.getElementById('bulk-review-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } catch (err: any) {
        toast.error(err.message || "Error processing file");
        console.error(err);
      } finally {
        setTimeout(() => {
          setIsBulkProcessing(false);
          setBulkProgress(0);
        }, 500);
      }
    };
    
    if (isExcel) {
      reader.readAsArrayBuffer(bulkFile);
    } else {
      reader.readAsText(bulkFile);
    }
  };
  
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImagePreview(data.url);
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  if (isEditing) {
    return (
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-[32px] overflow-hidden bg-white animate-in zoom-in-95 duration-300">
        <CardHeader className="p-6 md:p-8 border-b border-gray-50 bg-[#F4F7F6]/30">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-xl md:text-2xl font-black text-[#0A2E1F] tracking-tight">
                {currentReview?.id ? "Edit Testimonial" : "New Testimonial"}
              </CardTitle>
              <CardDescription className="text-sm md:text-base text-gray-400 font-medium">Add a genuine customer experience to the platform.</CardDescription>
            </div>
            <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-full w-10 h-10 p-0 hover:bg-red-50 hover:text-red-500">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                id: currentReview?.id,
                authorName: formData.get("authorName"),
                language: formData.get("language"),
                country: formData.get("country"),
                city: formData.get("city"),
                vehicle: formData.get("vehicle"),
                authorImageUrl: formData.get("authorImageUrl"),
                rating: parseInt(formData.get("rating") as string),
                content: formData.get("content"),
                isApproved: formData.get("isApproved") === "on",
              };
              saveMutation.mutate(data);
            }}
            className="space-y-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Customer Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#60E677] transition-colors" />
                  <Input name="authorName" defaultValue={currentReview?.authorName} required className="pl-12 h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Language</label>
                <Input name="language" defaultValue={currentReview?.language || "English"} className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Country</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#60E677] transition-colors" />
                  <Input name="country" defaultValue={currentReview?.country} className="pl-12 h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                <Input name="city" defaultValue={currentReview?.city} className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Vehicle</label>
                <div className="relative group">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#60E677] transition-colors" />
                  <Input name="vehicle" defaultValue={currentReview?.vehicle} placeholder="e.g. Ford Mustang Fastback 1965" className="pl-12 h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Author Avatar</label>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="relative group w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                  {imagePreview || currentReview?.authorImageUrl ? (
                    <img src={imagePreview || currentReview?.authorImageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-gray-200" />
                  )}
                  <button 
                    type="button"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Upload className="w-6 h-6 text-white" />
                  </button>
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} 
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-[#60E677] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 w-full space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Or Paste Image URL</label>
                  <div className="relative group">
                    <Input 
                      name="authorImageUrl" 
                      value={imagePreview || currentReview?.authorImageUrl || ""} 
                      onChange={(e) => setImagePreview(e.target.value)}
                      placeholder="https://..." 
                      className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" 
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">Use a direct URL for external images or upload a file.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Rating Star (1-5)</label>
              <Input name="rating" type="number" min="1" max="5" defaultValue={currentReview?.rating || 5} required className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-[#60E677]/5" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Testimonial Content</label>
              <textarea
                name="content"
                defaultValue={currentReview?.content}
                required
                className="w-full bg-gray-50/50 border border-gray-100 p-6 rounded-[32px] h-[200px] font-medium text-[#0A2E1F] focus:ring-4 focus:ring-[#60E677]/5 transition-all outline-none"
              />
            </div>

            <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
              <div className="flex flex-col">
                <span className="font-black text-[#0A2E1F]">Approval Status</span>
                <span className="text-xs text-gray-400 font-medium">Show this testimonial on the live site?</span>
              </div>
              <input 
                type="checkbox" 
                name="isApproved" 
                id="isApproved" 
                defaultChecked={currentReview?.isApproved} 
                className="w-6 h-6 rounded-lg accent-[#60E677]"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={saveMutation.isPending}
                className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-[#0A2E1F] hover:bg-[#1D4D3A] text-white font-black text-base shadow-xl shadow-black/10 transition-all active:scale-[0.98]"
              >
                {saveMutation.isPending ? "Saving..." : "Save Testimonial"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-auto h-14 px-10 rounded-2xl border-gray-100 font-black text-gray-500 hover:bg-gray-50 transition-all"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8 items-start">
        {/* Bulk Upload Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-6 md:p-8 border-b border-gray-50 bg-[#F4F7F6]/30">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#2F884D]/10 flex items-center justify-center mb-4 border border-[#2F884D]/20">
              <Upload className="w-6 h-6 md:w-7 md:h-7 text-[#2F884D]" />
            </div>
            <CardTitle className="text-xl md:text-2xl font-black text-[#0A2E1F] tracking-tight">Bulk Import</CardTitle>
            <CardDescription className="text-sm md:text-base text-gray-400 font-medium">Import reviews via CSV file.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div 
              className={cn(
                "border-2 border-dashed rounded-[32px] p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative overflow-hidden",
                bulkFile ? "border-[#60E677] bg-green-50/20" : "border-gray-100 bg-gray-50/50 hover:bg-white hover:border-[#60E677]/50"
              )}
              onClick={() => document.getElementById('bulk-review-upload')?.click()}
            >
              {bulkFile ? (
                <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-[#60E677]/10 flex items-center justify-center mb-4 border border-[#60E677]/20">
                    <FileSpreadsheet className="w-8 h-8 text-[#60E677]" />
                  </div>
                  <span className="text-sm font-black text-[#0A2E1F] max-w-[200px] truncate">{bulkFile.name}</span>
                  {totalRows !== null && (
                    <span className="text-[10px] font-bold text-[#2F884D] uppercase tracking-widest mt-1">
                      {totalRows} {totalRows === 1 ? 'Testimonial' : 'Testimonials'} Detected
                    </span>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileSelect(null);
                      const fileInput = document.getElementById('bulk-review-upload') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-200 group-hover:text-[#60E677] transition-colors mb-2" />
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Select CSV or Excel</span>
                </>
              )}
              <input id="bulk-review-upload" type="file" accept=".csv, .xlsx, .xls" className="hidden" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} />
            </div>

            {isBulkProcessing && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#0A2E1F]">
                  <span>Processing file...</span>
                  <span>{bulkProgress}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#60E677] transition-all duration-300 ease-out rounded-full shadow-[0_0_10px_rgba(96,230,119,0.5)]" 
                    style={{ width: `${bulkProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 transition-colors">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#0A2E1F] uppercase tracking-wider">Force Live</span>
                <span className="text-[9px] text-gray-400 font-medium leading-none mt-1">Approve all reviews in this file automatically?</span>
              </div>
              <input 
                type="checkbox" 
                checked={forceLive} 
                onChange={(e) => setForceLive(e.target.checked)}
                className="w-5 h-5 rounded-lg accent-[#60E677] cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handleBulkUpload} disabled={!bulkFile} className="h-12 rounded-2xl bg-[#0A2E1F] hover:bg-[#1D4D3A] font-black shadow-lg shadow-black/5 active:scale-95 transition-all">
                Upload & Process
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowManageUploads(!showManageUploads)}
                className={cn(
                  "h-12 rounded-2xl border-gray-100 font-black text-xs transition-all",
                  showManageUploads ? "bg-red-50 text-red-500 border-red-100" : "text-gray-400 hover:bg-white"
                )}
              >
                {showManageUploads ? "Close Batch Manager" : "Manage Recent Uploads"}
              </Button>
              <Button variant="outline" onClick={() => {
                const headers = "Language,Country,City,Name,Vehicle,Rating,Testimonial,authorImageUrl,isApproved\n";
                const row = '"French","France","Paris","Jean-Marc L.","Ford Mustang Fastback 1965",5,"J’ai reçu ma Ford Mustang Fastback 1965 et elle correspond parfaitement aux photos. Très satisfait de l’accompagnement et du sérieux.","","true"\n';
                const blob = new Blob([headers + row], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "reviews_template.csv";
                a.click();
              }} className="h-12 rounded-2xl border-gray-100 text-gray-400 font-black text-[10px] hover:bg-white transition-all">
                Download CSV Template
              </Button>
            </div>

            {showManageUploads && (
              <div className="pt-4 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#0A2E1F] uppercase tracking-widest">Recent Batches</span>
                </div>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {batchesLoading ? (
                    <div className="text-center py-4 text-[10px] font-bold text-gray-300 animate-pulse uppercase tracking-widest">Loading batches...</div>
                  ) : batchList?.map((batch: any) => {
                    const batchId = batch.batchId;
                    const count = batch.count;
                    const fileName = batchId.split('_').slice(2).join('_') || 'Unknown File';
                    const date = new Date(parseInt(batchId.split('_')[1])).toLocaleDateString();
                    
                    return (
                      <div key={batchId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[#0A2E1F] truncate max-w-[120px]">{fileName}</span>
                          <span className="text-[9px] text-gray-400 font-medium">{date} • {count} rows</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            setConfirmDelete({ type: 'batch', id: batchId, count });
                          }}
                          className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                  {(!batchList || batchList.length === 0) && !batchesLoading && (
                    <div className="text-center py-8 text-gray-400 text-[10px] font-bold italic">No batches found</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews List Section */}
        <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-[32px] overflow-hidden bg-white">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col">
                  <CardTitle className="text-2xl md:text-3xl font-black text-[#0A2E1F] tracking-tight">Testimonials</CardTitle>
                  <CardDescription className="text-sm md:text-base text-gray-400 font-medium">Manage and moderate customer reviews.</CardDescription>
                </div>
                <Button 
                  onClick={() => { 
                    setCurrentReview(null); 
                    setImagePreview(null);
                    setIsEditing(true); 
                  }}
                  className="w-full md:w-auto h-12 rounded-xl md:rounded-2xl bg-[#60E677] hover:bg-[#52c967] text-[#003B21] font-black shadow-xl shadow-green-100/50 active:scale-[0.98]"
                >
                  <Plus className="w-5 h-5 mr-2" /> New Review
                </Button>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#60E677] transition-colors" />
                  <Input 
                    placeholder="Search by name, vehicle, or city..." 
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-12 h-12 bg-gray-50 border-transparent rounded-2xl font-bold focus:bg-white focus:ring-4 focus:ring-[#60E677]/5 transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <select 
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setPage(1);
                    }}
                    className="h-10 md:h-12 px-3 md:px-6 bg-gray-50 border-transparent rounded-2xl font-bold text-[#0A2E1F] text-[11px] md:text-sm focus:bg-white focus:ring-4 focus:ring-[#60E677]/5 outline-none transition-all cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Public</option>
                    <option value="hidden">Hidden</option>
                  </select>
                  <select 
                    value={filterRating}
                    onChange={(e) => {
                      setFilterRating(e.target.value);
                      setPage(1);
                    }}
                    className="h-10 md:h-12 px-3 md:px-6 bg-gray-50 border-transparent rounded-2xl font-bold text-[#0A2E1F] text-[11px] md:text-sm focus:bg-white focus:ring-4 focus:ring-[#60E677]/5 outline-none transition-all cursor-pointer"
                  >
                    <option value="all">All Stars</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                  {(search || filterStatus !== "all" || filterRating !== "all") && (
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setSearch("");
                        setFilterStatus("all");
                        setFilterRating("all");
                        setPage(1);
                      }}
                      className="h-10 md:h-12 rounded-2xl text-red-500 hover:bg-red-50 font-black px-4 text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {isLoading ? (
              <div className="grid gap-4 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-6 border border-gray-50 rounded-[28px] bg-white space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100" />
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="w-32 h-4 bg-gray-100 rounded-md" />
                        <div className="w-48 h-3 bg-gray-50 rounded-md" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-3 bg-gray-50 rounded-md" />
                      <div className="w-2/3 h-3 bg-gray-50 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {reviews?.length === 0 && (
                  <div className="text-center py-20 bg-gray-50 rounded-[32px] border border-dashed border-gray-100">
                    <Star className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-[#0A2E1F] font-black">No testimonials found</p>
                  </div>
                )}
                {reviews?.map((review: any) => (
                  <div key={review.id} className="group p-4 md:p-6 border border-gray-50 rounded-2xl md:rounded-[28px] bg-white hover:border-[#60E677]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex items-start gap-4 md:gap-5 w-full">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 flex-shrink-0 overflow-hidden">
                          {review.authorImageUrl ? (
                            <img src={review.authorImageUrl} alt={review.authorName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 md:w-7 md:h-7 text-gray-300" />
                          )}
                        </div>
                        <div className="flex flex-col w-full">
                          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                            <h3 className="font-black text-[#0A2E1F] text-sm md:text-base tracking-tight">{review.authorName}</h3>
                            <div className={cn(
                              "px-2 py-0.5 rounded-md text-[7px] md:text-[8px] font-black uppercase tracking-wider",
                              review.isApproved ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                            )}>
                              {review.isApproved ? "Public" : "Hidden"}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-bold text-gray-400 mt-0.5">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" />
                              <span className="truncate max-w-[120px] sm:max-w-none">{review.city}, {review.country} ({review.language})</span>
                            </div>
                            <span className="mx-0.5 md:mx-1">•</span>
                            <div className="flex items-center gap-1">
                              <Car className="w-2.5 h-2.5" />
                              <span className="truncate max-w-[150px] sm:max-w-none">{review.vehicle}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 mt-1.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={cn(
                                  "w-3 h-3", 
                                  i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-100 fill-gray-50"
                                )} 
                              />
                            ))}
                          </div>
                          <p className="text-gray-500 font-medium text-[11px] md:text-xs mt-2 leading-relaxed line-clamp-2 italic w-full border-l-2 border-gray-50 pl-3">
                            "{review.content}"
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 w-full sm:w-auto justify-end border-t sm:border-0 pt-3 sm:pt-0 border-gray-50">
                        <Button variant="ghost" size="icon" onClick={() => { 
                          setCurrentReview(review); 
                          setImagePreview(review.authorImageUrl);
                          setIsEditing(true); 
                        }} className="w-10 h-10 md:w-10 md:h-10 rounded-lg md:rounded-xl text-gray-400 hover:text-[#0A2E1F] hover:bg-gray-50">
                          <Edit className="w-4 h-4 md:w-4 md:h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => {
                          setConfirmDelete({ type: 'single', id: review.id });
                        }} className="w-10 h-10 md:w-10 md:h-10 rounded-lg md:rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50">
                          <Trash className="w-4 h-4 md:w-4 md:h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-8 mt-12 pt-8 border-t border-gray-50">
                {/* Top Row: Data Summary */}
                <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50 px-6 py-2.5 rounded-full border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">Showing</span>
                    <span className="text-[#0A2E1F]">{Math.min((page - 1) * limit + 1, result?.total || 0)} - {Math.min(page * limit, result?.total || 0)}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <span className="text-[#0A2E1F] underline decoration-[#60E677] decoration-2 underline-offset-4">{result?.total || 0}</span>
                    <span className="text-gray-300">Results Total</span>
                  </div>
                </div>
                
                {/* Bottom Row: Page Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={page === 1}
                      onClick={() => setPage(1)}
                      className="w-10 h-10 rounded-xl text-gray-400 hover:text-[#0A2E1F] hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <ChevronLeft className="w-4 h-4 -ml-2.5" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="w-10 h-10 rounded-xl text-gray-400 hover:text-[#0A2E1F] hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-1.5 px-4 border-x border-gray-100">
                    {(() => {
                      const pages = [];
                      const showEllipsis = totalPages > 5;
                      
                      if (!showEllipsis) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        if (page <= 3) {
                          pages.push(1, 2, 3, 4, '...', totalPages);
                        } else if (page >= totalPages - 2) {
                          pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                        } else {
                          pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
                        }
                      }
                      
                      return pages.map((p, i) => p === '...' ? (
                        <div key={`dots-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-300">
                          <MoreHorizontal className="w-4 h-4" />
                        </div>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p as number)}
                          className={cn(
                            "w-10 h-10 rounded-xl font-black text-[11px] transition-all duration-300",
                            page === p 
                              ? "bg-[#0A2E1F] text-[#60E677] shadow-xl shadow-black/10 scale-110" 
                              : "text-gray-400 hover:text-[#0A2E1F] hover:bg-gray-50"
                          )}
                        >
                          {p}
                        </button>
                      ));
                    })()}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="w-10 h-10 rounded-xl text-gray-400 hover:text-[#0A2E1F] hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={page === totalPages}
                      onClick={() => setPage(totalPages)}
                      className="w-10 h-10 rounded-xl text-gray-400 hover:text-[#0A2E1F] hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <ChevronRight className="w-4 h-4 -ml-2.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <AlertDialogContent className="rounded-[32px] border-none shadow-2xl p-8 bg-white">
          <AlertDialogHeader className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-2">
              <Trash className="w-8 h-8 text-red-500" />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-[#0A2E1F] tracking-tight">
              {confirmDelete?.type === 'batch' ? 'Delete Entire Batch?' : 'Delete Testimonial?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 font-medium text-base">
              {confirmDelete?.type === 'batch' 
                ? `This will permanently remove ${confirmDelete.count} reviews from the database. This action cannot be undone.` 
                : "Are you sure you want to remove this testimonial? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="h-14 rounded-2xl border-gray-100 font-black text-gray-500 hover:bg-gray-50 transition-all flex-1 sm:flex-none px-8">
              Keep it
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (confirmDelete?.type === 'batch') {
                  deleteBatchMutation.mutate(confirmDelete.id);
                } else if (confirmDelete?.id) {
                  deleteMutation.mutate(confirmDelete.id);
                }
                setConfirmDelete(null);
              }}
              className="h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black shadow-xl shadow-red-100/50 transition-all active:scale-[0.98] flex-1 sm:flex-none px-8"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
