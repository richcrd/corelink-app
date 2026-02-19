import { create } from "zustand";
import type { User } from "@/src/models/User";
import type { AuthSession } from "@/src/services/authService";
import { secureStore } from "@/src/storage/secureJson";
import { STORAGE_KEYS } from "@/src/storage/storageKeys";

type AuthStatus = "hydrating" | "authenticated" | "unauthenticated";

type AuthStore = {
  hasHydrated: boolean;
  status: AuthStatus;
  token: string | null;
  user: User | null;
  hydrate: () => Promise<void>;
  setSession: (session: AuthSession) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  hasHydrated: false,
  status: "hydrating",
  token: null,
  user: null,

  async hydrate() {
    const [token, user] = await Promise.all([
      secureStore.get<string>(STORAGE_KEYS.auth.token),
      secureStore.get<User>(STORAGE_KEYS.auth.user),
    ]);

    if (!token || !user) {
      return set({
        token: null,
        user: null,
        status: "unauthenticated",
        hasHydrated: true,
      });
    }

    set({
      token,
      user,
      status: "authenticated",
      hasHydrated: true,
    });
  },

  async setSession(session) {
    await Promise.all([
      secureStore.set(STORAGE_KEYS.auth.token, session.token),
      secureStore.set(STORAGE_KEYS.auth.user, session.user),
    ]);

    set({
      token: session.token,
      user: session.user,
      status: "authenticated",
    });
  },

  async logout() {
    await Promise.all([
      secureStore.remove(STORAGE_KEYS.auth.token),
      secureStore.remove(STORAGE_KEYS.auth.user),
    ]);

    set({
      token: null,
      user: null,
      status: "unauthenticated",
    });
  },
}));
