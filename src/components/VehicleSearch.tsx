import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Search, ChevronDown, SlidersHorizontal, ChevronUp } from "lucide-react";

const YEAR_MIN = 1810;
const YEAR_MAX = 2026;
const PRICE_MIN = 15000;
const PRICE_MAX = 1000000;
const MILEAGE_MAX = 500000;

interface VehicleSearchProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  allVehicles: any[];
}

const VehicleSearch = ({ filters, onFilterChange, allVehicles }: VehicleSearchProps) => {
  const [pricing, setPricing] = useState([PRICE_MIN, PRICE_MAX]);
  const [yearRange, setYearRange] = useState([YEAR_MIN, YEAR_MAX]);
  const [mileageRange, setMileageRange] = useState([0, MILEAGE_MAX]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const extraFiltersRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFilterChange({ ...filters, search: searchValue });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue, filters, onFilterChange]);

  const uniqueSorted = (field: string) =>
    [...new Set(allVehicles.map((a) => a[field]).filter(Boolean))].sort() as string[];

  const makes = useMemo(() => uniqueSorted("brand"), [allVehicles]);
  const models = useMemo(() => {
    if (filters.brand) {
      return [
        ...new Set(allVehicles.filter((a) => a.brand === filters.brand).map((a) => a.model)),
      ].sort() as string[];
    }
    return [...new Set(allVehicles.map((a) => a.model))].sort() as string[];
  }, [allVehicles, filters.brand]);

  const bodyTypes = useMemo(() => uniqueSorted("bodyType"), [allVehicles]);
  const colors = useMemo(() => uniqueSorted("color"), [allVehicles]);
  const engines = useMemo(() => uniqueSorted("engine"), [allVehicles]);
  const transmissions = useMemo(() => uniqueSorted("transmission"), [allVehicles]);

  const handleFilterClick = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: filters[key] === value ? null : value });
  };

  const setSortBy = (value: string) => {
    onFilterChange({ ...filters, sortBy: value });
  };

  const buildRangePayload = () => {
    const minYear =
      yearRange[0] === YEAR_MIN && yearRange[1] === YEAR_MAX ? null : yearRange[0];
    const maxYear =
      yearRange[0] === YEAR_MIN && yearRange[1] === YEAR_MAX ? null : yearRange[1];
    const minPrice =
      pricing[0] === PRICE_MIN && pricing[1] === PRICE_MAX ? null : pricing[0];
    const maxPrice =
      pricing[0] === PRICE_MIN && pricing[1] === PRICE_MAX ? null : pricing[1];
    const minMileage =
      mileageRange[0] === 0 && mileageRange[1] === MILEAGE_MAX ? null : mileageRange[0];
    const maxMileage =
      mileageRange[0] === 0 && mileageRange[1] === MILEAGE_MAX ? null : mileageRange[1];
    return { minYear, maxYear, minPrice, maxPrice, minMileage, maxMileage };
  };

  const applyRangeFilters = () => {
    onFilterChange({ ...filters, ...buildRangePayload() });
  };

  const yearLabel =
    yearRange[0] === YEAR_MIN && yearRange[1] === YEAR_MAX
      ? "Any year"
      : `${yearRange[0]} – ${yearRange[1]}`;

  const priceLabel =
    pricing[0] === PRICE_MIN && pricing[1] === PRICE_MAX
      ? "Any price"
      : `$${pricing[0].toLocaleString()} – $${pricing[1].toLocaleString()}`;

  return (
    <div className="bg-[#f2f4f8] py-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-[28px] font-bold text-[#1b2533] mb-6 tracking-tight">Search Vehicles</h2>

          <div className="relative flex items-center mb-5">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by make, model, or keyword..."
              className="w-full pl-12 pr-32 h-14 bg-white border border-gray-200 rounded-xl text-[15px] focus-visible:ring-1 focus-visible:ring-[#2f884d] transition-all"
            />
            <Button 
              onClick={() => onFilterChange({ ...filters, search: searchValue })}
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-[#2f884d] hover:bg-[#25733f] text-white px-8 h-11 rounded-lg font-semibold shadow-sm transition-colors"
            >
              Search
            </Button>
          </div>

          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              className="w-full justify-between h-12 rounded-xl border-gray-200 text-[#1b2533] font-bold"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                {isFiltersVisible ? "Hide Filters" : "Show Filters"}
              </div>
              {isFiltersVisible ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
          </div>

          <div className={`${isFiltersVisible ? "block" : "hidden"} lg:block`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-[#f8f9fc] border-none hover:bg-gray-100 text-[#475569] h-10 px-4 rounded-lg font-semibold"
                    >
                      {filters.brand || "All Makes"} <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 max-h-[min(320px,70vh)] overflow-y-auto">
                    <DropdownMenuItem
                      onSelect={() => onFilterChange({ ...filters, brand: null, model: null })}
                    >
                      All makes
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {makes.map((make) => (
                      <DropdownMenuItem
                        key={make}
                        onSelect={() => {
                          if (filters.brand === make) {
                            onFilterChange({ ...filters, brand: null, model: null });
                          } else {
                            onFilterChange({ ...filters, brand: make, model: null });
                          }
                        }}
                      >
                        {make}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-[#f8f9fc] border-none hover:bg-gray-100 text-[#475569] h-10 px-4 rounded-lg font-semibold"
                    >
                      {filters.model || "All Models"} <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 max-h-[min(320px,70vh)] overflow-y-auto">
                    <DropdownMenuItem onSelect={() => handleFilterClick("model", null)}>
                      All models
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {models.map((model) => (
                      <DropdownMenuItem key={model} onSelect={() => handleFilterClick("model", model)}>
                        {model}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-[#f8f9fc] border-none hover:bg-gray-100 text-[#475569] h-10 px-4 rounded-lg font-semibold max-w-[220px] truncate"
                    >
                      {yearLabel} <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Year presets</DropdownMenuLabel>
                    <DropdownMenuItem
                      onSelect={() => {
                        setYearRange([YEAR_MIN, YEAR_MAX]);
                        onFilterChange({ ...filters, minYear: null, maxYear: null });
                      }}
                    >
                      Any year
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {[
                      { label: "Before 1990", range: [1810, 1990] as const },
                      { label: "1990 – 2000", range: [1990, 2000] as const },
                      { label: "2000 – 2010", range: [2000, 2010] as const },
                      { label: "2010 – 2020", range: [2010, 2020] as const },
                      { label: "2020 – 2026", range: [2020, YEAR_MAX] as const },
                    ].map(({ label, range }) => (
                      <DropdownMenuItem
                        key={label}
                        onSelect={() => {
                          setYearRange([range[0], range[1]]);
                          onFilterChange({
                            ...filters,
                            minYear: range[0],
                            maxYear: range[1],
                          });
                        }}
                      >
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-[#f8f9fc] border-none hover:bg-gray-100 text-[#475569] h-10 px-4 rounded-lg font-semibold max-w-[240px] truncate"
                    >
                      {priceLabel} <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Price range</DropdownMenuLabel>
                    <DropdownMenuItem
                      onSelect={() => {
                        setPricing([PRICE_MIN, PRICE_MAX]);
                        onFilterChange({ ...filters, minPrice: null, maxPrice: null });
                      }}
                    >
                      Any price
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {
                        setPricing([PRICE_MIN, 25000]);
                        onFilterChange({ ...filters, minPrice: PRICE_MIN, maxPrice: 25000 });
                      }}
                    >
                      Up to $25,000
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        setPricing([25000, 50000]);
                        onFilterChange({ ...filters, minPrice: 25000, maxPrice: 50000 });
                      }}
                    >
                      $25,000 – $50,000
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        setPricing([50000, 100000]);
                        onFilterChange({ ...filters, minPrice: 50000, maxPrice: 100000 });
                      }}
                    >
                      $50,000 – $100,000
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        setPricing([100000, 250000]);
                        onFilterChange({ ...filters, minPrice: 100000, maxPrice: 250000 });
                      }}
                    >
                      $100,000 – $250,000
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        setPricing([250000, PRICE_MAX]);
                        onFilterChange({ ...filters, minPrice: 250000, maxPrice: PRICE_MAX });
                      }}
                    >
                      $250,000+
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-[#f8f9fc] border-none hover:bg-gray-100 text-[#475569] h-10 px-4 rounded-lg font-semibold"
                    >
                      More <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Body type</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="max-h-[min(280px,60vh)] overflow-y-auto">
                        <DropdownMenuItem
                          onSelect={() => handleFilterClick("bodyType", null)}
                        >
                          All body types
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {bodyTypes.map((bt) => (
                          <DropdownMenuItem key={bt} onSelect={() => handleFilterClick("bodyType", bt)}>
                            {bt}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Color</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="max-h-[min(280px,60vh)] overflow-y-auto">
                        <DropdownMenuItem onSelect={() => handleFilterClick("color", null)}>
                          All colors
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {colors.map((c) => (
                          <DropdownMenuItem key={c} onSelect={() => handleFilterClick("color", c)}>
                            {c}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Engine</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="max-h-[min(280px,60vh)] overflow-y-auto">
                        <DropdownMenuItem onSelect={() => handleFilterClick("engine", null)}>
                          All engines
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {engines.map((e) => (
                          <DropdownMenuItem key={e} onSelect={() => handleFilterClick("engine", e)}>
                            {e}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Sort by:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hover:bg-transparent text-[#1b2533] font-semibold px-2 h-8">
                      {filters.sortBy || "Newest"} <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setSortBy("Newest")}>Newest</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSortBy("Lowest mileage")}>
                      Lowest mileage
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="bg-[#f8f9fc] rounded-2xl p-5 border border-gray-100/50">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-end mb-6">
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-gray-500">Pricing</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-base font-bold text-[#1b2533]">${pricing[0].toLocaleString()}</span>
                    <span className="text-base font-bold text-[#1b2533]">${pricing[1].toLocaleString()}</span>
                  </div>
                  <Slider
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={1000}
                    value={pricing}
                    onValueChange={setPricing}
                    className="[&_[role=slider]]:bg-[#2f884d] [&_[role=slider]]:border-[#2f884d] [&_.relative]:bg-[#2f884d]"
                  />
                </div>

                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-gray-500">Year</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-base font-bold text-[#1b2533]">{yearRange[0]}</span>
                    <span className="text-base font-bold text-[#1b2533]">{yearRange[1]}</span>
                  </div>
                  <Slider
                    min={YEAR_MIN}
                    max={YEAR_MAX}
                    step={1}
                    value={yearRange}
                    onValueChange={setYearRange}
                    className="[&_[role=slider]]:bg-[#2f884d] [&_[role=slider]]:border-[#2f884d] [&_.relative]:bg-[#2f884d]"
                  />
                </div>

                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-gray-500">Mileage</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-base font-bold text-[#1b2533]">
                      {mileageRange[0].toLocaleString()}
                    </span>
                    <span className="text-base font-bold text-[#1b2533]">
                      {mileageRange[1].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={MILEAGE_MAX}
                    step={100}
                    value={mileageRange}
                    onValueChange={setMileageRange}
                    className="[&_[role=slider]]:bg-[#2f884d] [&_[role=slider]]:border-[#2f884d] [&_.relative]:bg-[#2f884d]"
                  />
                </div>

                <div className="w-full lg:w-auto mt-4 lg:mt-0 pb-1">
                  <Button
                    type="button"
                    onClick={() => extraFiltersRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
                    className="w-full lg:w-auto bg-[#2f884d] hover:bg-[#25733f] text-white px-8 h-10 rounded-lg font-semibold transition-colors"
                  >
                    More Filters
                  </Button>
                </div>
              </div>

              <div
                ref={extraFiltersRef}
                className="flex flex-col lg:flex-row gap-4 justify-between items-end scroll-mt-24"
              >
                <div className="flex flex-col sm:flex-row gap-4 w-full flex-wrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 bg-white border-none hover:bg-gray-50 text-[#475569] h-10 px-4 rounded-lg font-semibold justify-between shadow-sm min-w-[140px]"
                      >
                        {filters.transmission || "Transmission"}{" "}
                        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 max-h-[min(280px,60vh)] overflow-y-auto">
                      <DropdownMenuItem onSelect={() => handleFilterClick("transmission", null)}>
                        All transmissions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {transmissions.map((t) => (
                        <DropdownMenuItem key={t} onSelect={() => handleFilterClick("transmission", t)}>
                          {t}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 bg-white border-none hover:bg-gray-50 text-[#475569] h-10 px-4 rounded-lg font-semibold justify-between shadow-sm min-w-[140px]"
                      >
                        {filters.bodyType || "Body type"} <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 max-h-[min(280px,60vh)] overflow-y-auto">
                      <DropdownMenuItem onSelect={() => handleFilterClick("bodyType", null)}>
                        All body types
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {bodyTypes.map((bt) => (
                        <DropdownMenuItem key={bt} onSelect={() => handleFilterClick("bodyType", bt)}>
                          {bt}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 bg-white border-none hover:bg-gray-50 text-[#475569] h-10 px-4 rounded-lg font-semibold justify-between shadow-sm min-w-[140px]"
                      >
                        {filters.engine || "Fuel / engine"}{" "}
                        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 max-h-[min(280px,60vh)] overflow-y-auto">
                      <DropdownMenuItem onSelect={() => handleFilterClick("engine", null)}>
                        All types
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {engines.map((e) => (
                        <DropdownMenuItem key={e} onSelect={() => handleFilterClick("engine", e)}>
                          {e}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="w-full lg:w-auto mt-4 lg:mt-0">
                  <Button
                    type="button"
                    onClick={applyRangeFilters}
                    className="w-full lg:w-auto bg-[#2f884d] hover:bg-[#25733f] text-white px-8 h-10 rounded-lg font-semibold transition-colors"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSearch;
