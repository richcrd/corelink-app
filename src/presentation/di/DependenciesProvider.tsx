import { createContext, useContext, useMemo, type ReactNode } from 'react';

import type { CatalogRepository } from '@/src/domain/repositories/CatalogRepository';
import type { AuthRepository } from '@/src/domain/repositories/AuthRepository';

import { CatalogRepositoryInMemory } from '@/src/infrastructure/repositories/catalog/CatalogRepositoryInMemory';
import { AuthRepositoryHttp } from '@/src/infrastructure/repositories/auth/AuthRepositoryHttp';

export type AppDependencies = {
  catalogRepository: CatalogRepository;
  authRepository: AuthRepository;
};

const DependenciesContext = createContext<AppDependencies | null>(null);

function createDependencies(): AppDependencies {
  return {
    catalogRepository: new CatalogRepositoryInMemory(),
    authRepository: new AuthRepositoryHttp(),
  };
}

export function DependenciesProvider({ children }: { children: ReactNode }) {
  const deps = useMemo(() => createDependencies(), []);
  return (
    <DependenciesContext.Provider value={deps}>
      {children}
    </DependenciesContext.Provider>
  );
}

export function useDependencies(): AppDependencies {
  const ctx = useContext(DependenciesContext);
  if (!ctx) {
    throw new Error('DependenciesProvider no está montado');
  }
  return ctx;
}
