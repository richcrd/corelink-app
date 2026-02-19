import type { Category } from "@/src/features/cart/types/Category";
import type { Product } from "@/src/features/cart/types/Product";

import { mockCategories, mockProducts } from "./mockCatalog";

export type Catalog = {
  categories: Category[];
  products: Product[];
};

export async function getCatalog(): Promise<Catalog> {
  // Por ahora: catálogo mock en memoria.
  return {
    categories: mockCategories,
    products: mockProducts,
  };
}
