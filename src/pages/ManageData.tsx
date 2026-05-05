import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download, Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const ManageData = () => {
  const { user, isLoading } = useAuth();
  
  const [exportFilter, setExportFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  if (isLoading) return null;

  // Strict check: User must be logged in and must be the admin
  const isAdmin = user?.role === "admin";

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleExportSample = () => {
    const headers = [
      "source", "url", "title", "subtitle", "year", "make", "model", "mileage", "vin", "transmission", "bodyType", "color", "engine", "location", "priceText", "priceNumeric", "description", "sellerName", "sellerAddress", "firstImage", "images", "specifications"
    ];
    
    const sampleData = [
      "classiccars.com",
      "https://classiccars.com/listings/view/2028814/1985-chevrolet-silverado-for-sale-in-sequim-washington-98382",
      "For Sale: 1985 Chevrolet Silverado in Sequim, Washington",
      "",
      "1985",
      "Chevrolet",
      "Silverado",
      "93329",
      "2GCHK34W8F1136645",
      "Automatic",
      "",
      "Black/Silver",
      "",
      "",
      "$68,000",
      "68000",
      "Silverado K30 I bought this beauty brand new back in 1984 when we lived in Anchorage, Alaska. It was a special order truck (VIN 2GCHK34W8F1136645) purchased from Good Chevrolet in Seattle, Washington. We bought the truck because we wanted a camper, so we ordered the Silverado K30 model, a 1 ton heavy duty chassis with the big 454 engine and 4 wheel drive. Since I financed it through our credit union, I bought the truck and camper through Good Chevrolet, but we flew down to Seattle and picked up the truck, without the tailgate, and drove it to Hollister, California to have the new camper installed on it. The camper was on the truck until 2022 except for about a month in 1992, when I removed the camper, modified it, and rebuilt it to make it nicer inside and outside. Good Chevrolet shipped the new tailgate to us in Anchorage, and the tailgate had never been out of its original packaging until I installed it in 2022. We moved to Sequim, Washington, in 1987 and the truck/camper was in our garage except for our camping trips every few years. The truck now has about 93K miles on it, with all of those miles on the highway on long distance trips. There is not a single dent anywhere on the pristine body and not a bit of rust anywhere. The paint is all original. There are a few very small paint chips here and there, but otherwise the paint is almost like new. Mechanically, the truck has been amazing. There have been no significant repairs necessary except for a new alternator and air conditioning compressor in 2019. When I replaced the compressor, I also replaced other A/C internal components like the receiver/drier and expansion valve and a complete R-12 refrigeration cleanout, evacuation, and restoration. All parts are genuine Delco, including the new alternator. The truck rides on 16 x 8\" American Racing polished aluminum wheels and new 285/75-16 Load Range E Michelin tires. The original exhaust system was replaced with headers and a dual exhaust system. That is the only modification to the drive train. It's got the Turbo 400 transmission, New Process 205 transfer case, and automatic locking hubs. I've always used Mobil One synthetic engine oil and even with 93K miles on it, it is only about a half a quart low when I change the oil and filter in 3-5K miles. The interior looks like new with GM rubber floor mats protecting the original carpet. The seat is almost perfect. I replaced the original radio with a more modern Pioneer unit with Bluetooth and USB. I added a Floscan fuel meter that measures instantaneous gas mileage and fuel used every tenth of a gallon. This is very handy for knowing how much fuel will be needed to fill both 20 gallon fuel tanks. The Floscan meter is mounted in the original ash tray location, so it could be removed if desired and the original ash tray reinstalled. I added a crossover tube to allow both tanks to be filled from either side. I also added a Stewart Warner vacuum gauge to keep an eye on engine performance, and a dash electrical panel with a voltmeter, two USB charging ports, and a 12 volt power outlet. Note that many of the photos were taken just before I removed the camper in 2022. It has always been inside one of my garages. We gave the camper to our son. I also have the complete set of OEM Helm service manuals, which are included of course. When I replaced the A/C compressor a few years ago I used a fraction of my 30 pound cylinder of very rare and expensive R-12 Freon. Since my other nine GM vehicles use newer refrigerants, the R-12 goes with the truck.",
      "Private Seller",
      "",
      "https://photos.classiccars.com/cc-temp/listing/202/8814/56682047-1985-chevrolet-silverado-std.jpg",
      "https://photos.classiccars.com/cc-temp/listing/202/8814/56682047-1985-chevrolet-silverado-std.jpg|https://photos.classiccars.com/cc-temp/listing/202/8814/56682050-1985-chevrolet-silverado-std.jpg|https://photos.classiccars.com/cc-temp/listing/202/8814/56682052-1985-chevrolet-silverado-std.jpg|https://photos.classiccars.com/cc-temp/listing/202/8814/56682055-1985-chevrolet-silverado-std.jpg|https://photos.classiccars.com/cc-temp/listing/202/8814/56682060-1985-chevrolet-silverado-std.jpg|https://photos.classiccars.com/cc-temp/listing/202/8814/56682064-1985-chevrolet-silverado-std.jpg",
      "{\"VIN\":\"2GCHK34W8F1136645\",\"Make\":\"Chevrolet\",\"Year\":\"1985\",\"Model\":\"Silverado\",\"Price\":\"$68,000\",\"Location\":\"Sequim, Washington\",\"Odometer\":\"93329\",\"Listing ID\":\"CC-2028814\",\"Trim Level\":\"Silverado\",\"Drive Train\":\"Part-time 4WD\",\"Power Locks\":\"Yes\",\"Power Brakes\":\"Yes\",\"Title Status\":\"Clear\",\"Transmission\":\"Automatic\",\"Power Windows\":\"Yes\",\"Seat Material\":\"Cloth\",\"Cruise Control\":\"Yes\",\"Engine History\":\"Original\",\"Exterior Color\":\"Black/Silver\",\"Interior Color\":\"Black\",\"Power Steering\":\"Yes\",\"Air Conditioning\":\"Yes\",\"Engine Condition\":\"Running\",\"Aftermarket Wheels\":\"Yes\",\"Exterior Condition\":\"Mint\",\"Restoration History\":\"Unrestored\"}"
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
      
      window.open(url, '_blank');
      toast.success("Export started");
    } catch (error) {
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }
    
    // Check extension
    if (!importFile.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setIsImporting(true);
    setImportProgress(10); // Start progress

    const formData = new FormData();
    formData.append("file", importFile);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE}/api/data/import`, true);
      xhr.withCredentials = true; // For cookies/auth

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 50; // Upload is first 50%
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
            // Reset file input visually
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
      
      // Fake progress for the processing part (50% to 90%)
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
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#0a2e1f] tracking-tight">Manage Data</h1>
          <p className="text-[#6A7870] mt-2">Import and export vehicle listings via CSV.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Export Section */}
          <Card className="border-[#E5ECE7] shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b border-[#E5ECE7] pb-5">
              <div className="w-10 h-10 rounded-full bg-[#f0fdf4] flex items-center justify-center mb-3">
                <Download className="w-5 h-5 text-[#16a34a]" />
              </div>
              <CardTitle className="text-xl font-bold text-[#0a2e1f]">Export Listings</CardTitle>
              <CardDescription>Download car listings to a CSV file.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5 bg-[#FAFCFB]">
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1b2533]">Date Filter</label>
                <Select value={exportFilter} onValueChange={setExportFilter}>
                  <SelectTrigger className="h-12 bg-white rounded-xl border-gray-200">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="custom">Custom Date Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {exportFilter === "custom" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1b2533]">Start Date</label>
                    <Input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-12 bg-white rounded-xl border-gray-200" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#1b2533]">End Date</label>
                    <Input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-12 bg-white rounded-xl border-gray-200" 
                    />
                  </div>
                </div>
              )}

              <Button 
                onClick={handleExportData}
                disabled={isExporting}
                className="w-full h-12 rounded-xl bg-[#0a2e1f] hover:bg-[#1a4d2e] text-white font-bold transition-colors"
              >
                {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                Export CSV
              </Button>
            </CardContent>
          </Card>

          {/* Import Section */}
          <Card className="border-[#E5ECE7] shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b border-[#E5ECE7] pb-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportSample}
                  className="rounded-lg border-gray-200 text-[#6A7870] hover:text-[#0a2e1f] hover:bg-gray-50 h-9"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Sample CSV
                </Button>
              </div>
              <CardTitle className="text-xl font-bold text-[#0a2e1f]">Import Listings</CardTitle>
              <CardDescription>Upload a CSV file to add or update car listings.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5 bg-[#FAFCFB]">
              
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-white flex flex-col items-center justify-center text-center">
                <FileSpreadsheet className="w-8 h-8 text-gray-300 mb-3" />
                <p className="text-sm text-[#1b2533] font-bold mb-1">Select a CSV file</p>
                <p className="text-xs text-gray-400 mb-4">Ensure columns match the sample format</p>
                
                <input 
                  type="file" 
                  id="csv-upload" 
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('csv-upload')?.click()}
                  className="h-10 rounded-lg border-gray-200 font-semibold"
                >
                  {importFile ? importFile.name : "Browse File"}
                </Button>
              </div>

              {importProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#6A7870]">
                    <span>Uploading & Processing</span>
                    <span>{Math.round(importProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${importProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleImport}
                disabled={isImporting || !importFile}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
              >
                {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Import Data
              </Button>
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ManageData;
