import { loginService, registerService } from "../services/auth.services";
import type { LoginCredentials, RegisterBody } from "../types/auth";
import { useAuthStore } from "../store/auth.store";

export function useAuth() {
  const setSession = useAuthStore((s) => s.setSession);

  return {
    login: async (credentials: LoginCredentials) => {
      const session = await loginService(credentials);
      await setSession(session);
    },
    register: async (body: RegisterBody) => {
      const session = await registerService(body);
      await setSession(session);
    },
  };
}
