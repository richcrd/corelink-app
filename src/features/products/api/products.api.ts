import { ENDPOINTS } from "@/src/shared/http/endpoints";
import { get } from "@/src/shared/http/http";
import { ProductDto } from "../types/Product";

export const getProductsByBranch = (branchId: string) =>
  get<ProductDto[]>(ENDPOINTS.product.getByBranch(branchId));
