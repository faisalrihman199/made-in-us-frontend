import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download, Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const ManageDataTab = () => {
  const [exportFilter, setExportFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const handleExportSample = () => {
    const headers = [
      "source", "url", "title", "subtitle", "year", "make", "model", "mileage", "vin", "transmission", "bodyType", "color", "engine", "location", "priceText", "priceNumeric", "description", "sellerName", "sellerAddress", "firstImage", "images", "specifications"
    ];
    
    const sampleData = [
      "classiccars.com",
      "https://classiccars.com/listings/view/2028814/1985-chevrolet-silverado",
      "For Sale: 1985 Chevrolet Silverado",
      "", "1985", "Chevrolet", "Silverado", "93329", "2GCHK34W8F1136645",
      "Automatic", "", "Black/Silver", "", "", "$68,000", "68000",
      "Sample description...", "Private Seller", "", "https://example.com/img.jpg",
      "https://example.com/img.jpg", "{}"
    ];

    const csvRow = sampleData.map(val => `"${val.replace(/"/g, '""')}"`).join(",");
    const csvContent = headers.join(",") + "\n" + csvRow;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "cars_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Sample CSV generated and downloaded");
  };

  const handleExportData = async () => {
    setIsExporting(true);
    setExportProgress(10);
    try {
      let url = `${API_BASE}/api/data/export`;
      if (exportFilter === "custom") {
        if (!startDate || !endDate) {
          toast.error("Please select both start and end dates");
          setIsExporting(false);
          return;
        }
        url += `?filter=custom&startDate=${startDate}&endDate=${endDate}`;
      } else {
        url += `?filter=all`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'text/csv'
        }
      });

      if (!response.ok) throw new Error("Export failed");

      const totalRecords = parseInt(response.headers.get('X-Total-Count') || "0");
      const totalRows = totalRecords + 1; // Include header row
      const reader = response.body?.getReader();
      
      let receivedRows = 0;
      let chunks = [];
      const decoder = new TextDecoder();
      
      if(reader) {
        while(true) {
          const {done, value} = await reader.read();
          if (done) break;
          chunks.push(value);
          
          if (totalRows > 0) {
            const text = decoder.decode(value, { stream: true });
            const newLines = (text.match(/\n/g) || []).length;
            receivedRows += newLines;
            
            const progress = (receivedRows / totalRows) * 100;
            setExportProgress(Math.min(99, progress)); 
          } else {
            setExportProgress(prev => Math.min(prev + 1, 99));
          }
        }
      }

      setExportProgress(100);
      const blob = new Blob(chunks, { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `cars_export_${new Date().getTime()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportProgress(100);
      toast.success("Export completed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 1000);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }
    
    if (!importFile.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setIsImporting(true);
    setImportProgress(10); 

    const formData = new FormData();
    formData.append("file", importFile);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE}/api/data/import`, true);
      xhr.withCredentials = true; 

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 50; 
          setImportProgress(10 + percentComplete);
        }
      };

      xhr.onload = () => {
        setIsImporting(false);
        setImportProgress(100);
        
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            toast.success(res.message || "Import completed successfully");
            setImportFile(null);
            const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
          } catch (e) {
            toast.success("Import completed");
          }
        } else {
          try {
            const res = JSON.parse(xhr.responseText);
            toast.error(res.message || "Import failed");
          } catch (e) {
            toast.error("Import failed");
          }
        }
        setTimeout(() => setImportProgress(0), 1000);
      };

      xhr.onerror = () => {
        setIsImporting(false);
        setImportProgress(0);
        toast.error("Network error during import");
      };

      xhr.send(formData);
      
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 90 || !isImporting) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 500);

    } catch (error) {
      setIsImporting(false);
      setImportProgress(0);
      toast.error("An error occurred during import");
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        {/* Export Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-6 md:p-8 border-b border-gray-50 bg-[#F4F7F6]/30">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#60E677]/10 flex items-center justify-center mb-4 border border-[#60E677]/20">
              <Download className="w-6 h-6 md:w-7 md:h-7 text-[#2F884D]" />
            </div>
            <CardTitle className="text-xl md:text-2xl font-black text-[#0A2E1F] tracking-tight">Export Listings</CardTitle>
            <CardDescription className="text-sm md:text-base text-gray-400 font-medium">Download car listings to a CSV file for analysis.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Date Filter</label>
              <Select value={exportFilter} onValueChange={setExportFilter}>
                <SelectTrigger className="h-14 bg-gray-50/50 rounded-2xl border-gray-100 px-6 font-bold text-[#0A2E1F] focus:ring-4 focus:ring-[#60E677]/5 transition-all">
                  <SelectValue placeholder="Select filter" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                  <SelectItem value="all" className="font-bold py-3">All Time</SelectItem>
                  <SelectItem value="custom" className="font-bold py-3">Custom Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {exportFilter === "custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Start Date</label>
                  <Input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-14 bg-gray-50/50 rounded-2xl border-gray-100 px-6 font-bold focus:ring-4 focus:ring-[#60E677]/5 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">End Date</label>
                  <Input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-14 bg-gray-50/50 rounded-2xl border-gray-100 px-6 font-bold focus:ring-4 focus:ring-[#60E677]/5 transition-all" 
                  />
                </div>
              </div>
            )}

            {exportProgress > 0 && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  <span>Preparing CSV...</span>
                  <span className="text-[#2F884D]">{Math.round(exportProgress)}%</span>
                </div>
                <div className="w-full bg-white rounded-full h-2.5 overflow-hidden border border-gray-100">
                  <div 
                    className="bg-[#60E677] h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(96,230,119,0.5)]" 
                    style={{ width: `${exportProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleExportData}
              disabled={isExporting}
              className="w-full h-14 rounded-2xl bg-[#0A2E1F] hover:bg-[#1D4D3A] text-white font-black text-base transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
            >
              {isExporting ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Download className="w-5 h-5 mr-3" />}
              Generate Export
            </Button>
          </CardContent>
        </Card>

        {/* Import Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="p-6 md:p-8 border-b border-gray-50 bg-[#F4F7F6]/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-[#2F884D]/10 flex items-center justify-center border border-[#2F884D]/20">
                <Upload className="w-6 h-6 md:w-7 md:h-7 text-[#2F884D]" />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportSample}
                className="w-full sm:w-auto rounded-xl border-gray-100 text-gray-500 font-bold hover:bg-white hover:text-[#0A2E1F] h-10 px-4 transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Sample
              </Button>
            </div>
            <CardTitle className="text-xl md:text-2xl font-black text-[#0A2E1F] tracking-tight">Import Listings</CardTitle>
            <CardDescription className="text-sm md:text-base text-gray-400 font-medium">Upload a CSV file to add or update multiple car listings.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            
            <div 
              className={cn(
                "border-2 border-dashed border-gray-100 rounded-2xl md:rounded-[32px] p-8 md:p-12 bg-gray-50/50 flex flex-col items-center justify-center text-center transition-all group hover:border-[#60E677]/50 hover:bg-white cursor-pointer",
                importFile && "border-[#60E677] bg-white border-solid"
              )}
              onClick={() => document.getElementById('csv-upload')?.click()}
            >
              <div className={cn(
                "w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-gray-50 group-hover:scale-110 transition-transform duration-300",
                importFile && "bg-[#60E677]/10 border-[#60E677]/20"
              )}>
                <FileSpreadsheet className={cn("w-8 h-8 text-gray-300", importFile && "text-[#2F884D]")} />
              </div>
              <p className="text-sm text-[#0A2E1F] font-black mb-1">
                {importFile ? importFile.name : "Select a CSV file"}
              </p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                {importFile ? `${(importFile.size / 1024).toFixed(1)} KB` : "Click to browse your files"}
              </p>
              
              <input 
                type="file" 
                id="csv-upload" 
                accept=".csv"
                className="hidden"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              />
            </div>

            {importProgress > 0 && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  <span>Uploading Data...</span>
                  <span className="text-[#2F884D]">{Math.round(importProgress)}%</span>
                </div>
                <div className="w-full bg-white rounded-full h-2.5 overflow-hidden border border-gray-100">
                  <div 
                    className="bg-[#2F884D] h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(47,136,77,0.5)]" 
                    style={{ width: `${importProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleImport}
              disabled={isImporting || !importFile}
              className="w-full h-14 rounded-2xl bg-[#60E677] hover:bg-[#52c967] text-[#003B21] font-black text-base transition-all shadow-xl shadow-green-100/50 active:scale-[0.98]"
            >
              {isImporting ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Upload className="w-5 h-5 mr-3" />}
              Process Import
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageDataTab;
