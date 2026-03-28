import { create } from "zustand";
import { User, AuthSession } from "../auth";
import { secureStore } from "@/src/shared/storage/secureJson";
import { STORAGE_KEYS } from "@/src/shared/storage/storageKeys";

type AuthStatus = "hydrating" | "authenticated" | "unauthenticated";

type AuthStore = {
  hasHydrated: boolean;
  status: AuthStatus;
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  hydrate: () => Promise<void>;
  setSession: (session: AuthSession) => Promise<void>;
  setTokens: (token: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  hasHydrated: false,
  status: "hydrating",
  token: null,
  refreshToken: null,
  user: null,

  async hydrate() {
    const [token, refreshToken, user] = await Promise.all([
      secureStore.get<string>(STORAGE_KEYS.auth.token),
      secureStore.get<string>(STORAGE_KEYS.auth.refreshToken),
      secureStore.get<User>(STORAGE_KEYS.auth.user),
    ]);

    if (!token || !refreshToken || !user) {
      return set({
        token: null,
        refreshToken: null,
        user: null,
        status: "unauthenticated",
        hasHydrated: true,
      });
    }

    set({
      token,
      refreshToken,
      user,
      status: "authenticated",
      hasHydrated: true,
    });
  },

  async setSession(session) {
    await Promise.all([
      secureStore.set(STORAGE_KEYS.auth.token, session.token),
      secureStore.set(STORAGE_KEYS.auth.refreshToken, session.refreshToken),
      secureStore.set(STORAGE_KEYS.auth.user, session.user),
    ]);

    set({
      token: session.token,
      refreshToken: session.refreshToken,
      user: session.user,
      status: "authenticated",
    });
  },

  async setTokens(token, refreshToken) {
    await Promise.all([
      secureStore.set(STORAGE_KEYS.auth.token, token),
      secureStore.set(STORAGE_KEYS.auth.refreshToken, refreshToken),
    ]);

    set({ token, refreshToken });
  },

  async logout() {
    await Promise.all([
      secureStore.remove(STORAGE_KEYS.auth.token),
      secureStore.remove(STORAGE_KEYS.auth.refreshToken),
      secureStore.remove(STORAGE_KEYS.auth.user),
    ]);

    set({
      token: null,
      refreshToken: null,
      user: null,
      status: "unauthenticated",
    });
  },
}));
