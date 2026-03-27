import { requests } from "@/src/shared/http/endpoints";
import { get } from "@/src/shared/http/http";
import { ProductDto } from "../types/Product";

export const getProductsByBranch = (branchId: number) =>
  get<ProductDto[]>(requests.product.getByBranch(branchId));

export const getProductsByBranchAndCategory = (branchId: number, categoryId: number, page: number = 1, pageSize: number = 10) =>
  get<ProductDto[]>(requests.product.getByBranchAndCategory(branchId, categoryId, page, pageSize));

export const getTopProductsWithPrice = (branchId: number) =>
  get<ProductDto[]>(requests.product.getTopWithPrice(branchId));


