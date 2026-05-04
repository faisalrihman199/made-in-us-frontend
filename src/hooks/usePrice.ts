import { useGlobalState } from "@/context/GlobalStateContext";

export function usePrice(usdPrice: number | null | undefined) {
  const { currency, exchangeRate } = useGlobalState();
  
  if (usdPrice === null || usdPrice === undefined) {
    return { formattedPrice: "Price on request", convertedPrice: 0, currency };
  }

  const convertedPrice = usdPrice * exchangeRate;
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(convertedPrice);

  return { formattedPrice, convertedPrice, currency };
}
