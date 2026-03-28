import { useQuery } from "@tanstack/react-query";
import { get } from "@/src/shared/http/http";
import { requests } from "@/src/shared/http/endpoints";

export type ProductCategoryDto = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

const getCategories = () =>
  get<ProductCategoryDto[]>(requests.productCategory.getAll);

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    refetchOnMount: "always",
  });
}
