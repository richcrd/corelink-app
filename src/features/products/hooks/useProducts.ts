import { useQuery } from "@tanstack/react-query";
import { getProductsByBranch } from "../api/products.api";

export function useProducts(branchId: string) {
  return useQuery({
    queryKey: ["products", branchId],
    queryFn: () => getProductsByBranch(branchId),
  });
}