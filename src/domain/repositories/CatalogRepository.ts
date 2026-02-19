import type { Category } from '../entities/Category';
import type { Product } from '../entities/Product';

export type Catalog = {
  categories: Category[];
  products: Product[];
};

export interface CatalogRepository {
  getCatalog(): Promise<Catalog>;
}
