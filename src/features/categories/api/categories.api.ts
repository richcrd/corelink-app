import { get } from "@/src/shared/http/http";
import { requests } from "@/src/shared/http/endpoints";
import type { ProductCategoryDto } from "../types/Category";

export const getCategories = () => {
  return get<ProductCategoryDto[]>(requests.productCategory.getAll);
};
