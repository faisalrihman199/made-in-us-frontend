import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, FileText, Camera, Tag, Ship, Lock, ArrowRight, ClipboardList } from "lucide-react";
import SafePay from './SafePay';
import ShippingBanner from './ShippingBanner';
import MembershipBanner from './MembershipBanner';
import QandA from './QandA';
import VehicleComments from './CommentsAndBids';
import RequestDetailsModal from "../modals/RequestDetailsModal";
import type { CarDetailsResponse } from "@/lib/api";
import { usePrice } from "@/hooks/usePrice";

// Dummy vehicle data - in a real app, this would come from an API
const generateDummyData = () => {
  return {
    highlights: [
      "This is a 2007 Lotus Elise, finished in Ardent Red with a black interior.",
      "The attached Carfax history report lists no accidents or mileage inconsistencies in this car's past.",
      "A partial list of notable equipment includes the Touring Pack, a removable hardtop, and air conditioning. The only notable modification is a Sector111 aluminum radiator.",
      "Lotus introduced the second-generation Elise in America for 2005. Nimble and mid-engined, it was developed as a pure driver's car with an exceptionally balanced chassis and only a handful of comfort and convenience features. American sales stopped in 2011, though the model lived on in overseas markets.",
      "Power comes from a 1.8-liter inline-4, rated at 190 horsepower and 133 lb-ft of torque. Output is sent to the rear wheels via a 6-speed manual transmission."
    ],
    equipment: [
      "Touring Pack (leather upholstery, carpet, additional sound insulation, storage net)",
      "16-inch front and 17-inch rear wheels",
      "Removable hardtop",
      "Air conditioning"
    ],
    modifications: [
      "Sector111 aluminum radiator"
    ],
    knownFlaws: [
      "Some exterior chips and scratches",
      "Blemishes on the wheels",
      "Some scratches on interior plastic trim"
    ],
    recentService: {
      date: "June 2025",
      mileage: 56486,
      work: ["Engine oil and filter changed"],
      note: "Additional service information is detailed in a service log that's included in the gallery."
    },
    includedItems: [
      "3 keys and 2 key fobs",
      "Service records",
      "Lotus-branded car cover",
      "Lotus-branded battery tender"
    ],
    ownershipHistory: "This Elise was reportedly purchased in December 2018, and has had about 16,000 miles added to it since.",
    videos: [
      {
        id: 1,
        title: "Cold Start and Walk Around",
        url: "https://youtube.com/shorts/UpFH3mtpXJU?si=SASwFvKLUARXSe5t",
        thumbnail: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d",
        duration: "0:28"
      },
      {
        id: 2,
        title: "Engine Sound and Acceleration",
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail: "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
        duration: "0:45"
      },
      {
        id: 3,
        title: "Interior Features Overview",
        url: "https://www.youtube.com/watch?v=example3",
        thumbnail: "https://images.unsplash.com/photo-1597007066704-67bf2068d5b2",
        duration: "1:15"
      },
      {
        id: 4,
        title: "Driving Experience",
        url: "https://www.youtube.com/watch?v=example4",
        thumbnail: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
        duration: "2:30"
      }
    ],
    carDetails: {
      make: "Lotus",
      model: "Elise",
      year: "2005",
      mileage: "56,600",
      vin: "SCCPC11167HL30173",
      title: "Clean (MA)",
      location: "Methuen, MA 01844",
      seller: null,
      specs: {
        engine: "1.8L I4",
        transmission: "Manual (6-Speed)",
        drivetrain: "Rear-wheel drive",
        bodyStyle: "Convertible",
        exteriorColor: "Ardent Red",
        interiorColor: "Black",
        sellerType: "Private Party"
      }
    }
  };
};

type AuctionDetailsProps = {
  car?: CarDetailsResponse;
};

const AuctionDetails = ({ car }: AuctionDetailsProps) => {
  const { formattedPrice: hookPrice } = usePrice(car?.price);
  const data = useMemo(() => {
    if (!car) return generateDummyData();

    const specs = (car.specifications ?? {}) as Record<string, unknown>;
    const normalizeKey = (k: string) => k.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const specAny = (keys: string[]) => {
      const wanted = keys.map(normalizeKey);
      for (const [k, v] of Object.entries(specs)) {
        if (!wanted.includes(normalizeKey(k))) continue;
        if (v === null || v === undefined) return "";
        if (typeof v === "string") return v;
        if (typeof v === "number") return String(v);
        if (typeof v === "boolean") return v ? "Yes" : "No";
        return "";
      }
      return "";
    };
    const specStr = (key: string) => {
      const v = specs[key];
      if (v === null || v === undefined) return "";
      if (typeof v === "string") return v;
      if (typeof v === "number") return String(v);
      if (typeof v === "boolean") return v ? "Yes" : "No";
      return "";
    };

    const highlights =
      car.description
        ?.split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 8) ?? [];

    const parseNumber = (s: string) => {
      const m = s.replace(/,/g, "").match(/\d+/);
      return m ? Number(m[0]) : NaN;
    };

    const odometerRaw = (
      specAny(["Odometer", "Odometer Reading", "OdometerReading"]) ||
      specAny(["Mileage", "Miles", "OdometerMiles"]) ||
      specStr("Odometer") ||
      specStr("Mileage") ||
      ""
    ).trim();
    const odometerNum = parseNumber(odometerRaw);

    // Prefer a non-zero odometer if present in specs. Many scrapes end up with `mileage=0`
    // in the structured column even when the raw spec value is populated.
    const mileageOrOdometer =
      Number.isFinite(odometerNum) && odometerNum > 0
        ? odometerNum.toLocaleString('en-US')
        : car.mileage != null && car.mileage > 0
          ? car.mileage.toLocaleString('en-US')
          : (odometerRaw || (car.mileage != null ? String(car.mileage) : ""));

    const formatMoneyFromText = (raw: string) => {
      const s = raw.trim();
      if (!s) return "";
      const m = s.match(/(\d[\d,]*)/);
      if (!m) return "";
      const n = Number(m[1].replace(/,/g, ""));
      if (!Number.isFinite(n)) return "";
      return `$${n.toLocaleString()}`;
    };

    const priceDisplay =
      car.price > 0 ? hookPrice : formatMoneyFromText(car.priceText || specStr("Price"));

    return {
      highlights,
      equipment: [],
      modifications: [],
      knownFlaws: [],
      recentService: { date: "", mileage: 0, work: [] as string[], note: "" },
      includedItems: [],
      ownershipHistory: "",
      videos: [],
      carDetails: {
        make: car.make ?? "",
        model: car.model ?? "",
        year: car.year ? String(car.year) : "",
        mileage: mileageOrOdometer,
        vin: car.vin ?? "",
        title: specStr("Title Status") || specStr("Title") || "",
        location: car.location ?? "",
        listingId: specStr("Listing ID") || "",
        price: priceDisplay,
        seller: car.sellerName ?? null,
        specs: {
          engine: (car.engine ?? specStr("Engine")) || "",
          transmission: (car.transmission ?? specStr("Transmission")) || "",
          drivetrain: specStr("Drivetrain") || "",
          bodyStyle: (car.bodyType ?? specStr("Body Style")) || "",
          exteriorColor: car.color ?? (specStr("Exterior Color") || specStr("Color") || ""),
          interiorColor: specStr("Interior Color") || "",
          sellerType: specStr("Seller Type") || ""
        }
      }
    };
  }, [car]);

  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const hasCar = Boolean(car);

  const hasValue = (v: unknown) => {
    if (v === null || v === undefined) return false;
    if (typeof v === "number") return true; // allow 0
    return String(v).trim().length > 0;
  };

  const allRows: [string, unknown][] = ([
    // identity + listing
    ["Make", data.carDetails.make],
    ["Year", data.carDetails.year],
    ["Model", data.carDetails.model],
    ["Mileage / Odometer", data.carDetails.mileage],
    ["VIN", data.carDetails.vin],
    ["Listing ID", (data.carDetails as any).listingId],
    ["Title Status", data.carDetails.title],
    ["Location", data.carDetails.location],
    ["Price", (data.carDetails as any).price],
    // mechanical / appearance
    ["Engine", data.carDetails.specs.engine],
    ["Transmission", data.carDetails.specs.transmission],
    ["Drivetrain", data.carDetails.specs.drivetrain],
    ["Body Style", data.carDetails.specs.bodyStyle],
    ["Exterior Color", data.carDetails.specs.exteriorColor],
    ["Interior Color", data.carDetails.specs.interiorColor],
  ] as [string, unknown][]).filter(([, v]) => hasValue(v));

  const splitIndex = Math.ceil(allRows.length / 2);
  const leftRows = allRows.slice(0, splitIndex);
  const rightRows = allRows.slice(splitIndex);

  const description = (car?.description ?? "").trim();

  return (
    <div className="max-w-screen-xl ">
      {/* Car specifications grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
          <table className="w-full text-[15px]">
            <tbody className="divide-y divide-gray-50">
              {leftRows.map(([label, value]) => (
                <tr key={label}>
                  <td className="py-4 px-6 font-semibold text-[#1b2533] bg-gray-50/30 w-1/2">{label}</td>
                  <td className="py-4 px-6 text-gray-600 font-medium">{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
          <table className="w-full text-[15px]">
            <tbody className="divide-y divide-gray-50">
              {rightRows.map(([label, value]) => (
                <tr key={label}>
                  <td className="py-4 px-6 font-semibold text-[#1b2533] bg-gray-50/30 w-1/2">{label}</td>
                  <td className="py-4 px-6 text-gray-600 font-medium">{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Details Section */}
      <div className="mt-12 bg-white border border-gray-100 rounded-[32px] p-8 sm:p-12 shadow-sm text-center">
        <h3 className="text-[22px] font-bold text-[#1b2533] mb-10">Contact our team to receive:</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="flex flex-col items-center gap-4 group">
            <div className="w-16 h-16 rounded-full bg-[#f8faf9] flex items-center justify-center transition-transform group-hover:scale-105">
              <ClipboardList className="w-8 h-8 text-[#2f884d]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#2f884d] text-[17px]">Full vehicle history</h4>
              <p className="text-[13px] text-gray-500 leading-snug max-w-[140px] mx-auto">Get a detailed report and all the facts.</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 group">
            <div className="w-16 h-16 rounded-full bg-[#f8faf9] flex items-center justify-center transition-transform group-hover:scale-105">
              <Camera className="w-8 h-8 text-[#2f884d]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#2f884d] text-[17px]">Additional photos & videos</h4>
              <p className="text-[13px] text-gray-500 leading-snug max-w-[140px] mx-auto">See every detail with high-quality media.</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 group">
            <div className="w-16 h-16 rounded-full bg-[#f8faf9] flex items-center justify-center transition-transform group-hover:scale-105">
              <Tag className="w-8 h-8 text-[#2f884d]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#2f884d] text-[17px]">Export price in EUR / USD</h4>
              <p className="text-[13px] text-gray-500 leading-snug max-w-[140px] mx-auto">Transparent pricing with no hidden fees.</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 group">
            <div className="w-16 h-16 rounded-full bg-[#f8faf9] flex items-center justify-center transition-transform group-hover:scale-105">
              <Ship className="w-8 h-8 text-[#2f884d]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[#2f884d] text-[17px]">Shipping options to your country</h4>
              <p className="text-[13px] text-gray-500 leading-snug max-w-[140px] mx-auto">Fast and reliable worldwide delivery.</p>
            </div>
          </div>
        </div>

        <div className="max-w-[800px] mx-auto space-y-5">
          <button 
            onClick={() => setIsDetailsModalOpen(true)}
            className="w-full bg-[#376b3f] hover:bg-[#2d5733] text-white h-16 rounded-2xl flex items-center justify-center gap-3 text-[20px] font-bold shadow-lg shadow-green-900/10 transition-all active:scale-[0.98]"
          >
            <FileText className="w-6 h-6" />
            Request Vehicle Details
            <ArrowRight className="w-6 h-6 ml-1" />
          </button>
          
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[13px] font-medium">Get full vehicle information, export price, shipping options and more.</span>
          </div>
        </div>
      </div>

      <RequestDetailsModal 
        isOpen={isDetailsModalOpen} 
        onOpenChange={setIsDetailsModalOpen}
        listingId={car?.id || ""}
        listingUrl={window.location.href}
        vehicleTitle={car?.title}
      />

      <div className="space-y-8 mt-12">
        {/* SafePay Section */}
        <SafePay />

        {/* Shipping Banner */}
        <ShippingBanner />
        
        {/* Membership Banner */}
        <MembershipBanner />
        {/* Q&A Section */}
        <QandA carId={car?.id} carModel={car?.title || "Vehicle"} />

        {/* Comments Section */}
        <VehicleComments carId={car?.id} carModel={car?.title || "Vehicle"} />
      </div>
    </div>
  );
};

export default AuctionDetails;