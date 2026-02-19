import type { Category } from "@/src/models/Category";
import type { Product } from "@/src/models/Product";

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
