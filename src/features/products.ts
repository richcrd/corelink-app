import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { get } from "@/src/shared/http/http";
import { requests } from "@/src/shared/http/endpoints";

export type ProductDto = {
  id: number;
  branchProductId: number;
  name: string;
  imageUrl: string | null;
  originalPrice: number;
  finalPrice: number;
  offerPrice: number | null;
  hasDiscount: boolean;
  discountPercentage: number | null;
};

const getProductsByBranch = (branchId: number) =>
  get<ProductDto[]>(requests.product.getByBranch(branchId));

const getProductsByBranchAndCategory = (branchId: number, categoryId: number, page: number = 1, pageSize: number = 10) =>
  get<ProductDto[]>(requests.product.getByBranchAndCategory(branchId, categoryId, page, pageSize));

const getTopProductsWithPrice = (branchId: number) =>
  get<ProductDto[]>(requests.product.getTopWithPrice(branchId));


export function useProducts(branchId: number | null) {
  return useQuery({
    queryKey: ["products", branchId],
    queryFn: () => getProductsByBranch(branchId as number),
    enabled: !!branchId,
  });
}

export function useTopProducts(branchId: number | null) {
  return useQuery({
    queryKey: ["products", "top", branchId],
    queryFn: () => getTopProductsWithPrice(branchId as number),
    enabled: !!branchId,
  });
}

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
