import type { LoginCredentials, RegisterBody } from '@/src/services/authService';
import { login, register } from '@/src/services/authService';
import { useAuthStore } from '@/src/presentation/stores/authStore';

export function useAuthActions() {
  const setSession = useAuthStore((s) => s.setSession);

  return {
    login: async (credentials: LoginCredentials) => {
      const session = await login(credentials);
      await setSession(session);
    },
    register: async (body: RegisterBody) => {
      const session = await register(body);
      await setSession(session);
    },
  };
}
