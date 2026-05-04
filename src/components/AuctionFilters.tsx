import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, X } from "lucide-react";

interface VehicleFiltersProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  allVehicles: any[];
}

const VehicleFilters = ({ filters, onFilterChange, allVehicles }: VehicleFiltersProps) => {
  // Extract unique values from vehicles for dropdown options
  const getUniqueValues = (field: string) => {
    const values = [...new Set(allVehicles.map((a) => a[field]))];
    return values.sort();
  };

  const years = getUniqueValues("year").slice(-15); // Last 15 years
  const brands = getUniqueValues("brand");
  const models = filters.brand
    ? [...new Set(allVehicles.filter((a) => a.brand === filters.brand).map((a) => a.model))].sort()
    : [];
  const bodyTypes = getUniqueValues("bodyType");
  const colors = getUniqueValues("color");
  const engines = getUniqueValues("engine");
  const transmissions = getUniqueValues("transmission");

  const sortOptions = ["Newly listed", "Lowest mileage"];

  const handleFilterClick = (key: string, value: any) => {
    if (filters[key] === value) {
      onFilterChange({ ...filters, [key]: null });
    } else {
      onFilterChange({ ...filters, [key]: value });
    }
  };

  const clearAllFilters = () => {
    onFilterChange({
      year: null,
      brand: null,
      model: null,
      bodyType: null,
      color: null,
      engine: null,
      minMileage: null,
      maxMileage: null,
      minPrice: null,
      maxPrice: null,
      transmission: null,
      sortBy: "Newly listed",
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (val) => val !== null && val !== "Newly listed"
  );

  return (
    <div className="bg-background px-4">
      <div className="max-w-screen-2xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* First Row: Title and Main Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">Browse Vehicles</h2>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {/* Year Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`h-10 ${
                    filters.year
                      ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  Year {filters.year && `(${filters.year})`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
                {filters.year && (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleFilterClick("year", null)}
                      className="text-blue-600 font-semibold"
                    >
                      Clear Year Filter
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {years.map((year) => (
                  <DropdownMenuItem
                    key={year}
                    onClick={() => handleFilterClick("year", year)}
                    className={filters.year === year ? "bg-blue-100 font-semibold" : ""}
                  >
                    {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Brand Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`h-10 ${
                    filters.brand
                      ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  Brand {filters.brand && `(${filters.brand})`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
                {filters.brand && (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleFilterClick("brand", null)}
                      className="text-blue-600 font-semibold"
                    >
                      Clear Brand Filter
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {brands.map((brand) => (
                  <DropdownMenuItem
                    key={brand}
                    onClick={() => handleFilterClick("brand", brand)}
                    className={filters.brand === brand ? "bg-blue-100 font-semibold" : ""}
                  >
                    {brand}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Model Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!filters.brand}
                  className={`h-10 ${
                    filters.model
                      ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  } disabled:opacity-50`}
                >
                  Model {filters.model && `(${filters.model})`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
                {filters.model && (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleFilterClick("model", null)}
                      className="text-blue-600 font-semibold"
                    >
                      Clear Model Filter
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {models.map((model) => (
                  <DropdownMenuItem
                    key={model}
                    onClick={() => handleFilterClick("model", model)}
                    className={filters.model === model ? "bg-blue-100 font-semibold" : ""}
                  >
                    {model}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Body Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`h-10 ${
                    filters.bodyType
                      ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  Body Type {filters.bodyType && `(${filters.bodyType})`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {filters.bodyType && (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleFilterClick("bodyType", null)}
                      className="text-blue-600 font-semibold"
                    >
                      Clear Body Type Filter
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {bodyTypes.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => handleFilterClick("bodyType", type)}
                    className={filters.bodyType === type ? "bg-blue-100 font-semibold" : ""}
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Color Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`h-10 ${
                    filters.color
                      ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  Color {filters.color && `(${filters.color})`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {filters.color && (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleFilterClick("color", null)}
                      className="text-blue-600 font-semibold"
                    >
                      Clear Color Filter
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {colors.map((color) => (
                  <DropdownMenuItem
                    key={color}
                    onClick={() => handleFilterClick("color", color)}
                    className={filters.color === color ? "bg-blue-100 font-semibold" : ""}
                  >
                    {color}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Engine Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`h-10 ${
                    filters.engine
                      ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  Engine {filters.engine && `(${filters.engine})`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {filters.engine && (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleFilterClick("engine", null)}
                      className="text-blue-600 font-semibold"
                    >
                      Clear Engine Filter
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {engines.map((engine) => (
                  <DropdownMenuItem
                    key={engine}
                    onClick={() => handleFilterClick("engine", engine)}
                    className={filters.engine === engine ? "bg-blue-100 font-semibold" : ""}
                  >
                    {engine}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Transmission Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`h-10 ${
                    filters.transmission
                      ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  Transmission {filters.transmission && `(${filters.transmission})`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {filters.transmission && (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleFilterClick("transmission", null)}
                      className="text-blue-600 font-semibold"
                    >
                      Clear Transmission Filter
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {transmissions.map((trans) => (
                  <DropdownMenuItem
                    key={trans}
                    onClick={() => handleFilterClick("transmission", trans)}
                    className={filters.transmission === trans ? "bg-blue-100 font-semibold" : ""}
                  >
                    {trans}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
            <span className="text-sm font-semibold text-gray-600">Sort by:</span>
            <div className="flex flex-wrap gap-3">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => onFilterChange({ ...filters, sortBy: option })}
                  className={`text-sm font-medium transition-colors ${
                    filters.sortBy === option
                      ? "text-gray-900 border-b-2 border-gray-900 pb-1"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleFilters;