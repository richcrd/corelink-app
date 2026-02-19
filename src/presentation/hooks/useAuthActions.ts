import type { LoginCredentials, RegisterBody } from '@/src/domain/repositories/AuthRepository';
import { loginUseCase } from '@/src/application/usecases/auth/login';
import { registerUseCase } from '@/src/application/usecases/auth/register';
import { useAuthStore } from '@/src/presentation/stores/authStore';
import { useDependencies } from '@/src/presentation/di/DependenciesProvider';

export function useAuthActions() {
  const setSession = useAuthStore((s) => s.setSession);
  const authRepository = useDependencies().authRepository;

  return {
    login: async (credentials: LoginCredentials) => {
      const session = await loginUseCase(authRepository, credentials);
      await setSession(session);
    },
    register: async (body: RegisterBody) => {
      const session = await registerUseCase(authRepository, body);
      await setSession(session);
    },
  };
}
