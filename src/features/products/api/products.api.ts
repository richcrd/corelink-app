import { requests } from "@/src/shared/http/endpoints";
import { get } from "@/src/shared/http/http";
import { ProductDto } from "../types/Product";

export const getProductsByBranch = (branchId: number) =>
  get<ProductDto[]>(requests.product.getByBranch(branchId));

export type ProductsByCategoryResponse = ProductDto[] | {
  items?: ProductDto[];
  data?: ProductDto[];
  records?: ProductDto[];
  page?: number;
  pageNumber?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  totalCount?: number;
  hasNextPage?: boolean;
  hasNext?: boolean;
  nextPage?: number | null;
};

export const getProductsByBranchAndCategory = (branchId: number, categoryId: number, page: number = 1, pageSize: number = 10) =>
  get<ProductsByCategoryResponse>(requests.product.getByBranchAndCategory(branchId, categoryId, page, pageSize));

