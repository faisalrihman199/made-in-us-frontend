import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface VehicleCardProps {
  id: string;
  title: string;
  subtitle: string;
  model?: string | null;
  price: number;
  image: string;
  featured?: boolean;
}

import { usePrice } from "@/hooks/usePrice";

const VehicleCard = ({
  id,
  title,
  subtitle,
  model,
  price,
  image,
  featured = false,
}: VehicleCardProps) => {
  const navigate = useNavigate();
  const { formattedPrice } = usePrice(price);
  const modelLabel = model?.trim() ? model : "Model coming soon";
  
  const handleClick = () => {
    const slug = title.toLowerCase().replace(/ /g, '-');
    navigate(`/cars/${id}/${slug}`);
  };

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden bg-gray-100 rounded-md leading-none">
          <img
            src={image}
            alt={title}
            className="block w-full h-full object-cover object-center bg-gray-100 align-middle group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {featured && (
          <Badge className="absolute top-2 left-2 bg-gray-900/80 text-white text-xs font-medium">
            FEATURED
          </Badge>
        )}
        <div className="absolute bottom-2 left-2">
          <div className="bg-black/75 text-white px-2 py-1 rounded text-sm font-medium backdrop-blur-sm">
            Price: {formattedPrice}
          </div>
        </div>
      </div>
      
      <div className="mt-3 space-y-1">
        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-700 text-sm font-medium line-clamp-1">
          {modelLabel}
        </p>
      </div>
    </div>
  );
};

export default VehicleCard;