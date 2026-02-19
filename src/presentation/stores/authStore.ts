import { create } from "zustand";

import type { User } from "@/src/domain/entities/User";
import type { AuthSession } from "@/src/domain/repositories/AuthRepository";
import {
  setApiAuthToken,
  setApiUnauthorizedHandler,
} from "@/src/infrastructure/http/authRuntime";
import {
  secureGetJson,
  secureRemove,
  secureSetJson,
} from "@/src/infrastructure/storage/secureJson";

const STORAGE_KEYS = {
  token: "corelink.jwt",
  user: "corelink.user",
} as const;

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

export const useAuthStore = create<AuthStore>((set, get) => ({
  hasHydrated: false,
  status: "hydrating",
  token: null,
  user: null,

  hydrate: async () => {
    try {
      set({ status: "hydrating" });
      const [token, user] = await Promise.all([
        secureGetJson<string>(STORAGE_KEYS.token),
        secureGetJson<User>(STORAGE_KEYS.user),
      ]);

      if (token) {
        setApiAuthToken(token);
        setApiUnauthorizedHandler(() => {
          // Avoid awaiting inside handler; fire-and-forget.
          get().logout();
        });
        set({
          token,
          user: user ?? null,
          status: "authenticated",
          hasHydrated: true,
        });
        return;
      }

      setApiAuthToken(null);
      set({
        token: null,
        user: null,
        status: "unauthenticated",
        hasHydrated: true,
      });
    } catch {
      setApiAuthToken(null);
      set({
        token: null,
        user: null,
        status: "unauthenticated",
        hasHydrated: true,
      });
    }
  },

  setSession: async (session) => {
    await Promise.all([
      secureSetJson(STORAGE_KEYS.token, session.token),
      secureSetJson(STORAGE_KEYS.user, session.user),
    ]);
    setApiAuthToken(session.token);
    setApiUnauthorizedHandler(() => {
      get().logout();
    });
    set({ token: session.token, user: session.user, status: "authenticated" });
  },

  logout: async () => {
    const { token } = get();
    if (token) {
      // No endpoint specified for logout; local cleanup is enough for now.
    }
    await Promise.all([
      secureRemove(STORAGE_KEYS.token),
      secureRemove(STORAGE_KEYS.user),
    ]);
    setApiAuthToken(null);
    setApiUnauthorizedHandler(null);
    set({ token: null, user: null, status: "unauthenticated" });
  },
}));
