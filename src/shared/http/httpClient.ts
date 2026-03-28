import axios from "axios";
import { ENV } from "@/src/config/env";
import { useAuthStore } from "@/src/features/store/auth.store";
import { authRepository } from "@/src/features/auth";

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;

type QueueEntry = {
  resolve: (token: string) => void;
  reject: (reason: unknown) => void;
};

let failedQueue: QueueEntry[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((entry) => {
    if (error) {
      entry.reject(error);
    } else {
      entry.resolve(token!);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 and not already a retry
    if (error?.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already in flight, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const { refreshToken, setTokens, logout } = useAuthStore.getState();

    if (!refreshToken) {
      isRefreshing = false;
      await logout();
      return Promise.reject(error);
    }

    try {
      const refreshed = await authRepository.refresh(refreshToken);

      await setTokens(refreshed.accessToken, refreshed.refreshToken);

      api.defaults.headers.common.Authorization = `Bearer ${refreshed.accessToken}`;
      processQueue(null, refreshed.accessToken);

      originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      await logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);


if (__DEV__) {
  api.interceptors.request.use((config) => {
    const url = getUrl(config);
    console.log(`→ ${config.method?.toUpperCase()} ${url}`, config.data ?? "");
    return config;
  });

  api.interceptors.response.use(
    (res) => {
      const url = getUrl(res.config);
      console.log(`← ${res.status} ${url}`);
      return res;
    },
    (err) => {
      const url = err?.config ? getUrl(err.config) : "";
      console.log(`← ${err?.response?.status ?? "×"} ${url}`);
      return Promise.reject(err);
    },
  );
}

function getUrl(config: any) {
  if (!config.baseURL) return config.url;
  return new URL(config.url ?? "", config.baseURL).toString();
}
