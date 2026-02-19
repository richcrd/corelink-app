import type { CatalogRepository, Catalog } from '@/src/domain/repositories/CatalogRepository';

export async function getCatalogUseCase(repo: CatalogRepository): Promise<Catalog> {
  return repo.getCatalog();
}
