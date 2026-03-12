import { ENDPOINTS } from "@/src/shared/http/endpoints";
import { get } from "@/src/shared/http/http";
import { ProductDto } from "../types/Product";

export const getProductsByBranch = (branchId: number) =>
  get<ProductDto[]>(ENDPOINTS.product.getByBranch(branchId));
