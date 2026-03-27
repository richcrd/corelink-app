import { useQuery } from "@tanstack/react-query";
import { getTopProductsWithPrice } from "../api/products.api";

export function useTopProducts(branchId: number | null) {
  return useQuery({
    queryKey: ["products", "top", branchId],
    queryFn: () => getTopProductsWithPrice(branchId as number),
    enabled: !!branchId,
  });
}
