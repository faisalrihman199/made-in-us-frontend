import { useEffect, useMemo, useState } from "react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search, SlidersHorizontal, ChevronDown, RotateCcw,
  Calendar, DollarSign, Gauge, Check, X, Trash2, Lightbulb,
  Zap, CarFront, Diamond, Wind, Truck, Tag, Car
} from "lucide-react";
import { IoSpeedometerOutline, IoBookmarkOutline } from "react-icons/io5";
import { fetchCars, fetchMakesModels, type MakeModelTriple } from "@/lib/api";

const YEAR_MIN = 1810;
const YEAR_MAX = 2026;
const PRICE_MIN = 15000;
const PRICE_MAX = 1000000;
const MILEAGE_MAX = 500000;

const VEHICLE_TYPES = [
  { id: "Muscle Car", icon: CarFront, img: "/cars/type/musclecar.png", fallbackImg: "https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=dodge&modelFamily=challenger&zoomType=fullscreen" },
  { id: "Classic Car", icon: CarFront, img: "/cars/type/classiccar.png", fallbackImg: "https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=ford&modelFamily=mustang&modelYear=1965&zoomType=fullscreen" },
  { id: "Exotic Car", icon: Diamond, img: "/cars/type/exoticcar.png", fallbackImg: "https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=lamborghini&modelFamily=huracan&zoomType=fullscreen" },
  { id: "Cabriolet", icon: Wind, img: "/cars/type/cabriolet.png", fallbackImg: "https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=mazda&modelFamily=mx-5&zoomType=fullscreen" },
  { id: "Pickup Truck", icon: Truck, img: "/cars/type/pickuptruck.png", fallbackImg: "https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=ford&modelFamily=f-150&zoomType=fullscreen" },
  { id: "Modern Car", icon: CarFront, img: "/cars/type/modern.png", fallbackImg: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=600" },
  { id: "SUV", icon: Car, img: "/cars/type/suv.png", fallbackImg: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=600" },
];

const BRAND_LOGOS: Record<string, string> = {
  "Dodge": "https://www.carlogos.org/car-logos/dodge-logo.png",
  "Ford": "https://www.carlogos.org/car-logos/ford-logo.png",
};

const ANALYZED_MAKES = [
  "Acura",
  "Audi",
  "BMW",
  "Cadillac",
  "Chevrolet",
  "Dodge",
  "Ferrari",
  "Ford",
  "GMC",
  "Honda",
  "Infiniti",
  "Jeep",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Mercedes-Benz",
  "Mitsubishi",
  "Nissan",
  "Porsche",
  "RAM",
  "Tesla",
  "Toyota"
];

const getBrandLogo = (make: string) => {
  if (make && BRAND_LOGOS[make]) return BRAND_LOGOS[make];
  const cleanMake = make?.toLowerCase().replace(/ /g, "");
  return `/cars/make/${cleanMake}.png`;
};

const getBrandFallback = (make: string) => {
  const cleanMake = make?.toLowerCase().replace(/ /g, "");
  // Try clearbit logo first, then fallback to imagin.studio car image
  return `https://logo.clearbit.com/${cleanMake}.com?size=80`;
}

const getImaginFallback = (make: string) => {
  return `https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=${make?.toLowerCase()}&zoomType=fullscreen&viewStep=01&width=100`;
}

const MODEL_IMAGES: Record<string, string> = {
  "Challenger": "/assets/filters/muscle_car.png",
  "Mustang": "/assets/filters/classic_car.png",
  "Corvette": "/assets/filters/exotic_car.png",
  "Camaro": "/assets/filters/muscle_car.png",
  "Tacoma": "/assets/filters/pickup_truck.png",
  "Wrangler": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300",
  "Model S": "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=300",
  "Model 3": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=300",
  "911": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=300",
  "G-Class": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=300",
};


interface VehicleSearchProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  allVehicles: any[];
}

const VehicleSearch = ({ filters, onFilterChange, allVehicles }: VehicleSearchProps) => {
  const { currency, exchangeRate } = useGlobalState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [tempFilters, setTempFilters] = useState(filters);

  // Sync internal filters with props
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  // Debounced search for the main bar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search && !isExpanded) {
        onFilterChange({ ...filters, search: searchValue });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue, filters, onFilterChange, isExpanded]);

  const [backendMakesModels, setBackendMakesModels] = useState<MakeModelTriple[]>([]);
  const [resultCount, setResultCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  // Load makes and models from backend
  useEffect(() => {
    fetchMakesModels()
      .then((data) => {
        setBackendMakesModels(data);
      })
      .catch((err) => console.error("Failed to load makes/models from backend:", err));
  }, []);

  // Fetch count of matching vehicles when tempFilters change
  useEffect(() => {
    let active = true;
    const getCount = async () => {
      setIsLoadingCount(true);
      try {
        const res = await fetchCars({
          page: 1,
          pageSize: 1,
          brand: tempFilters.brand,
          model: tempFilters.model,
          bodyType: tempFilters.bodyType,
          minYear: tempFilters.minYear,
          maxYear: tempFilters.maxYear,
          minPrice: tempFilters.minPrice,
          maxPrice: tempFilters.maxPrice,
          minMileage: tempFilters.minMileage,
          maxMileage: tempFilters.maxMileage,
          transmission: tempFilters.transmission,
          search: tempFilters.search || searchValue
        });
        if (active) {
          setResultCount(res.total);
        }
      } catch (err) {
        console.error("Failed to fetch matching results count:", err);
      } finally {
        if (active) {
          setIsLoadingCount(false);
        }
      }
    };
    
    getCount();
    return () => {
      active = false;
    };
  }, [tempFilters, searchValue]);

  const makes = useMemo(() => {
    let allowedMakes: string[] = [];
    if (tempFilters.bodyType) {
      allowedMakes = backendMakesModels
        .filter((item) => item.bodyType?.toLowerCase() === tempFilters.bodyType?.toLowerCase())
        .map((item) => item.make)
        .filter(Boolean);
    } else {
      allowedMakes = backendMakesModels.map((item) => item.make).filter(Boolean);
    }

    const combined = new Set([...ANALYZED_MAKES, ...allowedMakes]);

    if (tempFilters.bodyType) {
      const activeMakesForType = new Set(
        backendMakesModels
          .filter((item) => item.bodyType?.toLowerCase() === tempFilters.bodyType?.toLowerCase())
          .map((item) => item.make?.toLowerCase())
          .filter(Boolean)
      );
      return Array.from(combined)
        .filter((make) => activeMakesForType.has(make.toLowerCase()))
        .sort();
    }

    return Array.from(combined).sort();
  }, [backendMakesModels, tempFilters.bodyType]);

  const models = useMemo(() => {
    let filteredTriples = backendMakesModels;

    if (tempFilters.bodyType) {
      filteredTriples = filteredTriples.filter(
        (item) => item.bodyType?.toLowerCase() === tempFilters.bodyType?.toLowerCase()
      );
    }

    if (tempFilters.brand) {
      filteredTriples = filteredTriples.filter(
        (item) => item.make?.toLowerCase() === tempFilters.brand?.toLowerCase()
      );
    }

    const matchedModels = filteredTriples.map((item) => item.model).filter(Boolean);
    return [...new Set(matchedModels)].sort();
  }, [backendMakesModels, tempFilters.bodyType, tempFilters.brand]);

  // Validate selected brand/model against current filtered lists
  useEffect(() => {
    if (tempFilters.brand && !makes.includes(tempFilters.brand)) {
      setTempFilters((prev) => ({ ...prev, brand: null, model: null }));
    }
  }, [makes, tempFilters.brand]);

  useEffect(() => {
    if (tempFilters.model && !models.includes(tempFilters.model)) {
      setTempFilters((prev) => ({ ...prev, model: null }));
    }
  }, [models, tempFilters.model]);

  const [modelImages, setModelImages] = useState<Record<string, string>>({});
  const [brandImages, setBrandImages] = useState<Record<string, string>>({});

  // Lazy load model images from backend if not locally cached
  useEffect(() => {
    if (!tempFilters.brand || models.length === 0) return;
    
    const brand = tempFilters.brand;
    models.forEach((model) => {
      const key = `${brand}|${model}`;
      if (MODEL_IMAGES[model] || modelImages[key]) return;
      
      fetchCars({ page: 1, pageSize: 1, brand, model })
        .then((res) => {
          if (res.items && res.items.length > 0 && res.items[0].firstImage) {
            setModelImages((prev) => ({
              ...prev,
              [key]: res.items[0].firstImage,
            }));
          }
        })
        .catch((err) => console.error("Error loading model image from backend:", err));
    });
  }, [models, tempFilters.brand]);

  const getModelImageSrc = (brand: string, model: string) => {
    if (!model) return "";
    if (MODEL_IMAGES[model]) return MODEL_IMAGES[model];
    const key = `${brand}|${model}`;
    if (modelImages[key]) return modelImages[key];
    return `https://cdn.imagin.studio/getimage?customer=hrjavascript-mastery&make=${brand?.toLowerCase()}&modelFamily=${model?.toLowerCase()}&zoomType=fullscreen&viewStep=01&width=150`;
  };

  const handleBrandImageError = (make: string, target: HTMLImageElement) => {
    if (!make) return;
    if (target.src.includes('/cars/make/')) {
      target.src = getBrandFallback(make);
    } else if (target.src.includes('logo.clearbit.com')) {
      target.src = getImaginFallback(make);
    } else {
      const key = make;
      if (brandImages[key]) {
        target.src = brandImages[key];
      } else {
        fetchCars({ page: 1, pageSize: 1, brand: make })
          .then((res) => {
            if (res.items && res.items.length > 0 && res.items[0].firstImage) {
              setBrandImages((prev) => ({
                ...prev,
                [key]: res.items[0].firstImage,
              }));
              target.src = res.items[0].firstImage;
            }
          })
          .catch((err) => console.error("Error loading brand image from backend:", err));
      }
    }
  };

  // Range updates
  const updateRange = (keyMin: string, keyMax: string, min: number, max: number) => {
    setTempFilters({ ...tempFilters, [keyMin]: min, [keyMax]: max });
  };

  const currentYearMin = tempFilters.minYear ?? YEAR_MIN;
  const currentYearMax = tempFilters.maxYear ?? YEAR_MAX;
  const currentPriceMin = tempFilters.minPrice ?? PRICE_MIN;
  const currentPriceMax = tempFilters.maxPrice ?? PRICE_MAX;

  const formatPrice = (price: number) => {
    const symbol = currency === 'EUR' ? '€' : '$';
    const converted = price * (currency === 'EUR' ? exchangeRate : 1);
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  };
  const currentMileageMin = tempFilters.minMileage ?? 0;
  const currentMileageMax = tempFilters.maxMileage ?? MILEAGE_MAX;

  const applyFilters = () => {
    onFilterChange(tempFilters);
    setIsExpanded(false);
  };

  const resetFilters = () => {
    const reset = {
      ...filters,
      brand: null,
      model: null,
      bodyType: null,
      minYear: null,
      maxYear: null,
      minPrice: null,
      maxPrice: null,
      minMileage: null,
      maxMileage: null,
      transmission: null,
    };
    setTempFilters(reset);
    onFilterChange(reset);
  };

  const removeFilter = (key: string, key2?: string) => {
    const updated = { ...tempFilters, [key]: null };
    if (key2) updated[key2] = null;
    setTempFilters(updated);
    onFilterChange(updated);
  };

  // Quick Select handlers
  const setYearQuick = (min: number, max: number) => updateRange("minYear", "maxYear", min, max);
  const setPriceQuick = (min: number, max: number) => updateRange("minPrice", "maxPrice", min, max);
  const setMileageQuick = (min: number, max: number) => updateRange("minMileage", "maxMileage", min, max);

  // Selected filters pill rendering
  const activeFilters = [];
  if (tempFilters.bodyType) {
    const vt = VEHICLE_TYPES.find(t => t.id === tempFilters.bodyType);
    activeFilters.push({ id: "bodyType", label: tempFilters.bodyType, icon: vt?.icon });
  }
  if (tempFilters.brand) {
    activeFilters.push({
      id: "brand",
      label: tempFilters.brand,
      img: getBrandLogo(tempFilters.brand),
      fallbackImg: getBrandFallback(tempFilters.brand)
    });
  }
  if (tempFilters.model) {
    activeFilters.push({
      id: "model",
      label: tempFilters.model,
      img: getModelImageSrc(tempFilters.brand!, tempFilters.model)
    });
  }
  if (tempFilters.minYear || tempFilters.maxYear) {
    activeFilters.push({ id: "year", label: `Year: ${currentYearMin} - ${currentYearMax}`, icon: Calendar, keys: ["minYear", "maxYear"] });
  }
  if (tempFilters.minPrice || tempFilters.maxPrice) {
    activeFilters.push({ id: "price", label: `Price: ${formatPrice(currentPriceMin)} - ${formatPrice(currentPriceMax)}`, icon: Tag, keys: ["minPrice", "maxPrice"] });
  }
  if (tempFilters.minMileage || tempFilters.maxMileage) {
    activeFilters.push({ id: "mileage", label: `Mileage: ${currentMileageMin.toLocaleString()} - ${currentMileageMax.toLocaleString()} mi`, icon: IoSpeedometerOutline, keys: ["minMileage", "maxMileage"] });
  }
  if (tempFilters.transmission) {
    activeFilters.push({ id: "transmission", label: `Transmission: ${tempFilters.transmission}`, icon: SlidersHorizontal });
  }

  return (
    <div className="bg-[#fcfcfd] py-6 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isExpanded ? (
          // Discovery View - Search Bar + Vehicle Types Grid
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_15px_40px_rgb(0,0,0,0.03)] border border-gray-100 max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Top Search Bar */}
            <div className="relative mb-8">
              <div className="flex items-center gap-2 bg-white rounded-[1.25rem] border border-gray-200 p-1.5 pl-3 transition-all hover:border-[#2f884d]/30 hover:shadow-lg hover:shadow-green-500/5 group">
                <div className="flex-1 flex items-center gap-2">
                  <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-gray-400 group-hover:text-[#2f884d] transition-colors flex-shrink-0" />
                  <Input
                    placeholder="Search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                    className="border-none focus-visible:ring-0 text-[13px] sm:text-[15px] font-medium bg-transparent placeholder:text-gray-400 h-8 sm:h-10 p-0 w-full"
                  />
                </div>
                <Button
                  onClick={applyFilters}
                  className="h-8 sm:h-10 px-4 sm:px-8 bg-[#2f884d] hover:bg-[#25733f] text-white rounded-[0.75rem] sm:rounded-xl font-bold text-[13px] sm:text-[16px] transition-all hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Browse Section */}
            <div className="mb-8">
              <h3 className="text-[17px] font-black text-gray-900 mb-6">Browse by vehicle type</h3>
              <div className="grid grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4">
                {VEHICLE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setTempFilters(prev => ({ ...prev, bodyType: type.id }));
                      setIsExpanded(true);
                    }}
                    className="group relative bg-white border border-gray-100 rounded-[1rem] sm:rounded-2xl p-1.5 sm:p-3 transition-all hover:border-[#2f884d] hover:shadow-lg hover:shadow-green-500/5 hover:-translate-y-0.5"
                  >
                    <div className="aspect-[16/10] mb-2 sm:mb-3 overflow-hidden rounded-lg sm:rounded-xl bg-gray-50 flex items-center justify-center p-0 sm:p-1.5">
                      <img
                        src={type.img}
                        alt={type.id}
                        className="w-full h-full object-contain scale-[1.35] sm:scale-100 transition-transform duration-500 group-hover:scale-[1.45] sm:group-hover:scale-110"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (type.fallbackImg) {
                            target.src = type.fallbackImg;
                          }
                        }}
                      />
                    </div>
                    <span className="text-[9px] sm:text-[13px] font-black text-gray-900 group-hover:text-[#2f884d] transition-colors leading-[1.15] text-center block w-full min-h-[2.3em] flex items-center justify-center mt-1">
                      {type.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Expand Toggle */}
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                  <SlidersHorizontal className="w-4 h-4 text-[#2f884d]" />
                </div>
                <span className="text-[16px] font-black text-gray-900 group-hover:text-[#2f884d] transition-colors">Show Filters</span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#2f884d] transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        ) : (
          // Expanded View - Full Filter Panel
          <div className="mt-8 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgb(0,0,0,0.04)] border border-gray-100 max-w-7xl mx-auto relative group/panel">
            <div className="p-8 sm:p-12 animate-in fade-in zoom-in duration-500">
              {/* Sticky Floating Close Button Container */}
              <div className="sticky top-28 h-0 w-full z-50 flex justify-end pointer-events-none">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="pointer-events-auto w-12 h-12 rounded-full bg-white border border-gray-100 text-gray-400 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:text-red-500 hover:border-red-100 hover:scale-110 active:scale-95 group -mt-4 -mr-4 sm:-mr-6"
                  title="Close Filters"
                >
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" strokeWidth={2.5} />
                </button>
              </div>

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-10 border-b border-gray-100 pb-6 pr-10">
                <div>
                  <h2 className="text-[32px] sm:text-[36px] font-black text-gray-900 tracking-tight leading-none mb-2">Find the Perfect Vehicle</h2>
                  <p className="text-[16px] text-gray-500 font-medium">Simple steps. Better results.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={resetFilters} className="text-[#2f884d] font-bold text-[15px] flex items-center gap-2 hover:bg-green-50/80 px-4 py-2.5 rounded-xl transition-colors">
                    <RotateCcw className="w-4 h-4" /> Reset all
                  </button>
                </div>
              </div>

              {/* Step 1: Choose Vehicle Type */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#2f884d] text-white flex items-center justify-center font-black text-[15px] shadow-sm">1</div>
                  <h3 className="text-[20px] font-black text-gray-900">Choose Vehicle Type</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
                  {VEHICLE_TYPES.map(type => {
                    const isActive = tempFilters.bodyType === type.id;
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setTempFilters({ ...tempFilters, bodyType: isActive ? null : type.id })}
                        className={`relative p-0 rounded-[1.25rem] border-2 cursor-pointer transition-all duration-300 flex flex-col group h-full overflow-hidden
                        ${isActive ? 'border-[#2f884d] bg-white shadow-[0_10px_30px_rgb(47,136,77,0.06)]' : 'border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/20'}`}
                      >
                        {isActive && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-[#2f884d] rounded-full flex items-center justify-center shadow-md z-10 animate-in zoom-in">
                            <Check className="w-3 h-3 text-white" strokeWidth={5} />
                          </div>
                        )}

                        <div className="w-full h-28 flex items-center justify-center bg-gray-50/30 overflow-hidden">
                          <img
                            src={type.img}
                            alt={type.id}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (type.fallbackImg) {
                                target.src = type.fallbackImg;
                              }
                            }}
                          />
                        </div>

                        <div className="flex flex-col items-center gap-2 p-4 pt-3 mt-auto">
                          <div className={`p-2 rounded-xl ${isActive ? 'bg-green-50' : 'bg-gray-50'} transition-colors`}>
                            <Icon className={`w-6 h-6 ${isActive ? 'text-[#2f884d]' : 'text-[#2f884d]/50'}`} strokeWidth={2.5} />
                          </div>
                          <span className={`text-[13px] font-black tracking-tight text-center leading-tight ${isActive ? 'text-[#2f884d]' : 'text-gray-900'}`}>
                            {type.id}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Choose Make & Model */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#2f884d] text-white flex items-center justify-center font-black text-[15px] shadow-sm">2</div>
                  <h3 className="text-[20px] font-black text-gray-900">Choose Make & Model</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 p-0">
                  <div>
                    <label className="block text-[14px] font-bold text-gray-700 mb-3 ml-1">Make</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full h-14 justify-between bg-white border-gray-200 hover:border-gray-300 hover:bg-white rounded-xl px-5 shadow-sm transition-all focus:ring-4 focus:ring-[#2f884d]/10">
                          <div className="flex items-center gap-3">
                            {tempFilters.brand ? (
                              <div className="w-7 h-7 rounded bg-gray-50 p-1 flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden">
                                <img
                                  src={getBrandLogo(tempFilters.brand)}
                                  onError={(e) => handleBrandImageError(tempFilters.brand!, e.currentTarget)}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center"><Zap className="w-4 h-4 text-gray-400" /></div>
                            )}
                            <span className="font-bold text-[16px] text-gray-900">{tempFilters.brand || "Select Make"}</span>
                          </div>
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto rounded-xl p-2">
                        <DropdownMenuItem onSelect={() => setTempFilters({ ...tempFilters, brand: null, model: null })} className="font-bold py-3 px-4 cursor-pointer rounded-lg hover:bg-gray-50 text-[15px]">
                          All Makes
                        </DropdownMenuItem>
                        {makes.map(make => (
                          <DropdownMenuItem
                            key={make}
                            onSelect={() => setTempFilters({ ...tempFilters, brand: make, model: null })}
                            className="font-semibold py-3 px-4 cursor-pointer rounded-lg hover:bg-gray-50 text-[15px]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-white p-1 flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden">
                                <img
                                  src={getBrandLogo(make)}
                                  onError={(e) => handleBrandImageError(make, e.currentTarget)}
                                  alt={make}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                              {make}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <label className="block text-[14px] font-bold text-gray-700 mb-3 ml-1">Model</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild disabled={!tempFilters.brand && models.length === 0}>
                        <Button variant="outline" className="w-full h-14 justify-between bg-white border-gray-200 hover:border-gray-300 hover:bg-white rounded-xl px-5 shadow-sm transition-all focus:ring-4 focus:ring-[#2f884d]/10 disabled:opacity-50">
                          <div className="flex items-center gap-3">
                            {tempFilters.model ? (
                              <div className="w-10 h-6 rounded overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                                <img src={getModelImageSrc(tempFilters.brand!, tempFilters.model)} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-10 h-6 rounded bg-gray-100 flex items-center justify-center"><CarFront className="w-4 h-4 text-gray-400" /></div>
                            )}
                            <span className="font-bold text-[16px] text-gray-900">{tempFilters.model || "Select Model"}</span>
                          </div>
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto rounded-xl p-2">
                        <DropdownMenuItem onSelect={() => setTempFilters({ ...tempFilters, model: null })} className="font-bold py-3 px-4 cursor-pointer rounded-lg hover:bg-gray-50 text-[15px]">
                          All Models
                        </DropdownMenuItem>
                        {models.map(model => (
                          <DropdownMenuItem
                            key={model}
                            onSelect={() => setTempFilters({ ...tempFilters, model: model })}
                            className="font-semibold py-3 px-4 cursor-pointer rounded-lg hover:bg-gray-50 text-[15px]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-7 rounded overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                                <img src={getModelImageSrc(tempFilters.brand!, model)} alt={model} className="w-full h-full object-cover" />
                              </div>
                              {model}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <p className="text-[13px] text-gray-400 mt-3 ml-1 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2f884d]"></span> Showing {currentYearMin} - {currentYearMax} models
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Refine Your Search */}
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#2f884d] text-white flex items-center justify-center font-black text-[15px] shadow-sm">3</div>
                  <h3 className="text-[20px] font-black text-gray-900">Refine Your Search</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Year Panel */}
                  <div className="border border-gray-100 rounded-[1.5rem] p-6 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center gap-2.5 mb-8">
                      <Calendar className="w-5 h-5 text-[#2f884d]" />
                      <span className="font-bold text-gray-900 text-[16px]">Year</span>
                    </div>
                    <div className="flex justify-between text-[15px] font-black text-gray-900 mb-4">
                      <span>{currentYearMin}</span>
                      <span>{currentYearMax}</span>
                    </div>
                    <div className="px-2 mb-8">
                      <Slider
                        min={YEAR_MIN} max={YEAR_MAX} step={1}
                        value={[currentYearMin, currentYearMax]}
                        onValueChange={(v) => updateRange("minYear", "maxYear", v[0], v[1])}
                        className="[&_[role=slider]]:bg-[#2f884d] [&_[role=slider]]:border-[#2f884d] [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&_[role=slider]]:shadow-md [&_.relative]:bg-[#2f884d]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <Button variant="outline" onClick={() => setYearQuick(YEAR_MIN, YEAR_MAX)} className="h-11 text-[13px] font-bold text-gray-600 rounded-xl border-gray-100 hover:border-[#2f884d]/30 hover:bg-green-50/30 transition-all bg-gray-50/50">Any year</Button>
                      <Button variant="outline" onClick={() => setYearQuick(YEAR_MAX - 3, YEAR_MAX)} className="h-11 text-[13px] font-bold text-gray-600 rounded-xl border-gray-100 hover:border-[#2f884d]/30 hover:bg-green-50/30 transition-all bg-gray-50/50">Last 3 years</Button>
                      <Button variant="outline" onClick={() => setYearQuick(YEAR_MAX - 5, YEAR_MAX)} className="h-11 text-[13px] font-bold text-gray-600 rounded-xl border-gray-100 hover:border-[#2f884d]/30 hover:bg-green-50/30 transition-all bg-gray-50/50">Last 5 years</Button>
                      <Button variant="outline" onClick={() => setYearQuick(YEAR_MAX - 10, YEAR_MAX)} className="h-11 text-[13px] font-bold text-gray-600 rounded-xl border-gray-100 hover:border-[#2f884d]/30 hover:bg-green-50/30 transition-all bg-gray-50/50">Last 10 years</Button>
                    </div>
                  </div>

                  {/* Budget Panel */}
                  <div className="border border-gray-100 rounded-[1.5rem] p-6 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center gap-2.5 mb-8">
                      <Tag className="w-5 h-5 text-[#2f884d]" />
                      <span className="font-bold text-gray-900 text-[16px]">Budget ({currency})</span>
                    </div>
                    <div className="flex justify-between text-[15px] font-black text-gray-900 mb-4">
                      <span>{formatPrice(currentPriceMin)}</span>
                      <span>{formatPrice(currentPriceMax)}</span>
                    </div>
                    <div className="px-2 mb-8">
                      <Slider
                        min={PRICE_MIN} max={PRICE_MAX} step={1000}
                        value={[currentPriceMin, currentPriceMax]}
                        onValueChange={(v) => updateRange("minPrice", "maxPrice", v[0], v[1])}
                        className="[&_[role=slider]]:bg-[#2f884d] [&_[role=slider]]:border-[#2f884d] [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&_[role=slider]]:shadow-md [&_.relative]:bg-[#2f884d]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <Button variant="outline" onClick={() => setPriceQuick(PRICE_MIN, 25000)} className="h-11 text-[13px] font-bold text-gray-600 rounded-xl border-gray-100 hover:border-[#2f884d]/30 hover:bg-green-50/30 transition-all px-0 bg-gray-50/50">Under {formatPrice(25000)}</Button>
                      <Button variant="outline" onClick={() => setPriceQuick(25000, 50000)} className="h-11 text-[13px] font-bold text-gray-600 rounded-xl border-gray-100 hover:border-[#2f884d]/30 hover:bg-green-50/30 transition-all px-0 bg-gray-50/50">{formatPrice(25000)} - {formatPrice(50000)}</Button>
                      <Button variant="outline" onClick={() => setPriceQuick(50000, 100000)} className="h-11 text-[13px] font-bold text-gray-600 rounded-xl border-gray-100 hover:border-[#2f884d]/30 hover:bg-green-50/30 transition-all px-0 bg-gray-50/50">{formatPrice(50000)} - {formatPrice(100000)}</Button>
                      <Button variant="outline" onClick={() => setPriceQuick(100000, PRICE_MAX)} className="h-11 text-[13px] font-bold text-gray-600 rounded-xl border-gray-100 hover:border-[#2f884d]/30 hover:bg-green-50/30 transition-all px-0 bg-gray-50/50">Over {formatPrice(100000)}</Button>
                    </div>
                  </div>

                  {/* Mileage Panel */}
                  <div className="border border-gray-100 rounded-[1.5rem] p-6 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center gap-2.5 mb-8">
                      <IoSpeedometerOutline className="w-6 h-6 text-[#2f884d]" />
                      <span className="font-bold text-gray-900 text-[16px]">Mileage</span>
                    </div>
                    <div className="flex justify-between text-[15px] font-black text-gray-900 mb-4">
                      <span>{currentMileageMin.toLocaleString()} mi</span>
                      <span>{currentMileageMax.toLocaleString()}+ mi</span>
                    </div>
                    <div className="px-2 mb-8">
                      <Slider
                        min={0} max={MILEAGE_MAX} step={1000}
                        value={[currentMileageMin, currentMileageMax]}
                        onValueChange={(v) => updateRange("minMileage", "maxMileage", v[0], v[1])}
                        className="[&_[role=slider]]:bg-[#2f884d] [&_[role=slider]]:border-[#2f884d] [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&_[role=slider]]:shadow-md [&_.relative]:bg-[#2f884d]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <Button variant="outline" onClick={() => setMileageQuick(0, 25000)} className="h-11 text-[13px] font-bold text-gray-600 rounded-xl border-gray-100 hover:border-[#2f884d]/30 hover:bg-green-50/30 transition-all px-0 bg-gray-50/50">Under 25k mi</Button>
                      <Button variant="outline" onClick={() => setMileageQuick(25000, 50000)} className="h-11 text-[13px] font-bold text-gray-600 rounded-xl border-gray-100 hover:border-[#2f884d]/30 hover:bg-green-50/30 transition-all px-0 bg-gray-50/50">25k - 50k mi</Button>
                      <Button variant="outline" onClick={() => setMileageQuick(50000, 100000)} className="h-11 text-[13px] font-bold text-gray-600 rounded-xl border-gray-100 hover:border-[#2f884d]/30 hover:bg-green-50/30 transition-all px-0 bg-gray-50/50">50k - 100k mi</Button>
                      <Button variant="outline" onClick={() => setMileageQuick(100000, MILEAGE_MAX)} className="h-11 text-[13px] font-bold text-gray-600 rounded-xl border-gray-100 hover:border-[#2f884d]/30 hover:bg-green-50/30 transition-all px-0 bg-gray-50/50">Over 100k mi</Button>
                    </div>
                  </div>
                </div>

                {showMoreFilters && (
                  <div className="mt-8 pt-8 border-t border-gray-100 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-8 h-8 rounded-full bg-[#2f884d]/10 text-[#2f884d] flex items-center justify-center font-black text-[15px]">
                        <Zap className="w-4 h-4" />
                      </div>
                      <h3 className="text-[18px] font-black text-gray-900">Additional Specifications</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[14px] font-bold text-gray-700 mb-4 ml-1">Transmission</label>
                        <div className="flex gap-4">
                          {["Automatic", "Manual"].map((type) => {
                            const isActive = tempFilters.transmission === type;
                            return (
                              <button
                                key={type}
                                onClick={() => setTempFilters({ ...tempFilters, transmission: isActive ? null : type })}
                                className={`flex-1 h-14 rounded-2xl border-2 font-bold text-[15px] transition-all flex items-center justify-center gap-3
                                ${isActive
                                    ? 'border-[#2f884d] bg-green-50 text-[#2f884d] shadow-sm'
                                    : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'}`}
                              >
                                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#2f884d]' : 'bg-gray-300'}`} />
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setShowMoreFilters(!showMoreFilters)}
                    className="text-[#2f884d] font-bold text-[15px] flex items-center gap-2 hover:underline bg-green-50/50 px-6 py-2.5 rounded-full transition-colors hover:bg-green-50"
                  >
                    {showMoreFilters ? "Show less" : "More filters"} <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showMoreFilters ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>            {/* Selected Filters Section */}
              <div className="mb-12 mt-12 border-t border-gray-100 pt-10">
                <h4 className="text-[18px] font-black text-gray-900 mb-6">Your Selected Filters</h4>
                {activeFilters.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-3">
                    {activeFilters.map(filter => {
                      const Icon = filter.icon;
                      return (
                        <div key={filter.id} className="flex items-center gap-2.5 px-4 py-2 bg-white border border-gray-100 text-[#2f884d] rounded-full font-bold text-[14px] shadow-sm transition-all hover:border-[#2f884d]/30">
                          {filter.img ? (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden border border-gray-100 bg-gray-50">
                              <img
                                src={filter.img}
                                alt=""
                                className="w-full h-full object-contain scale-125"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (filter.fallbackImg && !target.src.includes('logo.clearbit.com')) {
                                    target.src = filter.fallbackImg;
                                  } else {
                                    target.parentElement?.classList.add('hidden');
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            Icon && <Icon className="w-4 h-4 text-[#2f884d]" />
                          )}
                          <span className="whitespace-nowrap">{filter.label}</span>
                          <div
                            className="w-5 h-5 ml-1 hover:bg-green-50 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                            onClick={() => removeFilter(filter.keys ? filter.keys[0] : filter.id, filter.keys ? filter.keys[1] : undefined)}
                          >
                            <X className="w-3.5 h-3.5 text-[#2f884d]/60 hover:text-[#2f884d]" />
                          </div>
                        </div>
                      )
                    })}
                    <button
                      onClick={resetFilters}
                      className="ml-auto text-[#2f884d] font-bold text-[14px] flex items-center gap-2 hover:opacity-80 transition-all px-4 py-2"
                    >
                      <Trash2 className="w-4 h-4" /> Clear all
                    </button>
                  </div>
                ) : (
                  <p className="text-[14px] text-gray-500 font-medium">No filters selected yet.</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col items-center gap-4 py-8 relative">
                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="flex-1 max-w-[400px]">
                    <Button
                      onClick={applyFilters}
                      disabled={isLoadingCount}
                      className="w-full h-14 bg-[#2f884d] hover:bg-[#25733f] text-white rounded-2xl font-black text-[18px] shadow-lg shadow-green-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-80"
                    >
                      {isLoadingCount ? "Loading..." : `Show ${resultCount !== null ? resultCount : 0} Results`}
                    </Button>
                  </div>
                  <div className="sm:absolute sm:right-0">
                    <Button variant="ghost" className="h-14 px-4 text-[#2f884d] hover:text-[#2f884d] hover:bg-green-50/50 rounded-2xl font-black text-[16px] flex items-center gap-2.5 transition-all">
                      <IoBookmarkOutline className="w-6 h-6 stroke-[2]" /> Save Search
                    </Button>
                  </div>
                </div>
                <span className="text-[14px] text-gray-400 font-bold">
                  {isLoadingCount ? "Updating count..." : `${resultCount !== null ? resultCount : 0} results`}
                </span>
              </div>

              {/* Recommendation */}
              <div className="mt-12 bg-gray-50/50 rounded-3xl p-8 flex gap-6 items-start border border-gray-100/50">
                <div className="bg-white p-4 rounded-2xl shadow-sm shrink-0">
                  <Lightbulb className="w-6 h-6 text-[#2f884d]" />
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 mb-1.5 text-[16px]">Expert Tip</h5>
                  <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
                    Refining your search with specific makes and models allows our experts to negotiate more effectively on your behalf. We specialize in securing the best deals in the US market—remember, we return 50% of all negotiated savings directly back to you!
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleSearch;
