import { useInfiniteQuery } from "@tanstack/react-query";
import { getProductsByBranchAndCategory } from "../api/products.api";
import type { ProductDto } from "../types/Product";

const PAGE_SIZE = 10;

type ProductsPage = {
  items: ProductDto[];
  nextPage: number | undefined;
};

export function useProductsByCategory(branchId: number | null, categoryId: number | null) {
  return useInfiniteQuery({
    queryKey: ["products", branchId, categoryId],
    queryFn: async ({ pageParam = 1 }) => {
      const page = await getProductsByBranchAndCategory(
        branchId as number,
        categoryId as number,
        pageParam,
        PAGE_SIZE,
      ) as Partial<{ items: ProductDto[]; pageNumber: number; hasNextPage: boolean }>;

      const items = Array.isArray(page.items) ? page.items : [];
      const currentPage = typeof page.pageNumber === "number" ? page.pageNumber : pageParam;
      const hasNextPage = !!page.hasNextPage;

      return {
        items,
        nextPage: hasNextPage ? currentPage + 1 : undefined,
      } as ProductsPage;
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    enabled: !!branchId && !!categoryId,
    initialPageParam: 1,
  });
}
