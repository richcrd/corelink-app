import { useQuery } from "@tanstack/react-query";
import { getProductsByBranch } from "../api/products.api";

export function useProducts(branchId: number | null) {
  return useQuery({
    queryKey: ["products", branchId],
    queryFn: () => getProductsByBranch(branchId as number),
    enabled: !!branchId,
  });
}