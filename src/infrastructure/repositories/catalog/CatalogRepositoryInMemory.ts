import type { CatalogRepository, Catalog } from '@/src/domain/repositories/CatalogRepository';
import { mockCategories, mockProducts } from '@/src/infrastructure/repositories/catalog/mockCatalog';

export class CatalogRepositoryInMemory implements CatalogRepository {
  async getCatalog(): Promise<Catalog> {
    return { categories: mockCategories, products: mockProducts };
  }
}
