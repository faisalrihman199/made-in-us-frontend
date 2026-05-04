import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import SafePay from './SafePay';
import ShippingBanner from './ShippingBanner';
import MembershipBanner from './MembershipBanner';
import QandA from './QandA';
import VehicleComments from './CommentsAndBids';
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <table className="w-full">
              <tbody className="divide-y">
                {leftRows.map(([label, value]) => (
                  <tr key={label}>
                    <td className="py-3 px-4 font-medium bg-gray-100">{label}</td>
                    <td className="py-3 px-4">{String(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody className="divide-y">
                {rightRows.map(([label, value]) => (
                  <tr key={label}>
                    <td className="py-3 px-4 font-medium bg-gray-100">{label}</td>
                    <td className="py-3 px-4">{String(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Additional Details Sections */}
      <div className="space-y-8 mt-8">
        {hasCar && description ? (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
          </section>
        ) : null}

        {/* Highlights */}
        {data.highlights.length ? (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
            <ul className="list-disc pl-5 space-y-2">
              {data.highlights.map((highlight, index) => (
                <li key={index} className="text-gray-700 leading-relaxed">
                  {highlight}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Equipment */}
        {data.equipment.length ? (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Equipment</h2>
            <p className="text-gray-700 mb-2">A partial list of notable equipment includes:</p>
            <ul className="list-disc pl-5 space-y-2">
              {data.equipment.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Modifications */}
        {data.modifications.length ? (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Modifications</h2>
            <p className="text-gray-700 mb-2">Notable modifications include:</p>
            <ul className="list-disc pl-5 space-y-2">
              {data.modifications.map((mod, index) => (
                <li key={index} className="text-gray-700">{mod}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Known Flaws */}
        {data.knownFlaws.length ? (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Known Flaws</h2>
            <ul className="list-disc pl-5 space-y-2">
              {data.knownFlaws.map((flaw, index) => (
                <li key={index} className="text-gray-700">{flaw}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Recent Service History */}
        {data.recentService?.work?.length ? (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Recent Service History</h2>
            <p className="text-gray-700 mb-2">
              The attached <span className="text-emerald-600 hover:underline cursor-pointer">Carfax</span> history report shows that the following services have been performed:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li className="text-gray-700">
                {data.recentService.date} ({data.recentService.mileage.toLocaleString()} miles): {data.recentService.work.join(", ")}
              </li>
            </ul>
            {data.recentService.note ? (
              <p className="text-gray-700 italic mt-2">
                {data.recentService.note}
              </p>
            ) : null}
          </section>
        ) : null}

        {/* Other Items Included */}
        {data.includedItems.length ? (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Other Items Included in Sale</h2>
            <ul className="list-disc pl-5 space-y-2">
              {data.includedItems.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Ownership History */}
        {data.ownershipHistory ? (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Ownership History</h2>
            <p className="text-gray-700">
              {data.ownershipHistory}
            </p>
          </section>
        ) : null}

        {/* Video Section */}
        {data.videos.length ? (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Video</h2>
            <div className="relative">
              <div className="flex gap-4 w-full overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
                {data.videos.map((video) => (
                <div 
                  key={video.id}
                  className="flex-none relative w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] rounded-lg overflow-hidden bg-black cursor-pointer group"
                  onClick={() => setPlayingVideo(playingVideo === video.id ? null : video.id)}
                >
                  {playingVideo === video.id ? (
                    <div className="aspect-video">
                      <iframe
                        src={`${video.url.replace('watch?v=', 'embed/')}?autoplay=1`}
                        className="w-full h-full"
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <>
                      {/* Video Thumbnail */}
                      <div className="relative aspect-video">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-zinc-900 border-b-8 border-b-transparent ml-1">
                            </div>
                          </div>
                        </div>
                        {/* Duration */}
                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-sm">
                          {video.duration}
                        </div>
                      </div>

                      {/* Video Title */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-white font-medium">{video.title}</h3>
                      </div>
                    </>
                  )}
                </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}


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