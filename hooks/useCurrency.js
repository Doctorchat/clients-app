import { useSelector } from "react-redux";
import { getGlobalCurrency } from "@/store/slices/bootstrapSlice";

const priceFormatter =
  (globalCurrency = null) =>
  (price, currency = null) => {
    const formatter = new Intl.NumberFormat("ro-MD", {
      style: "currency",
      currency: currency || globalCurrency || "MDL",
      minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
    });
    return formatter.format(price);
  };

const useCurrency = () => {
  const globalCurrency = useSelector(getGlobalCurrency);
  // with global currency
  const formatPrice = priceFormatter(globalCurrency);

  return { globalCurrency, formatPrice };
};

export default useCurrency;
