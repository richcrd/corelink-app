import axios from "axios";
import { ENV } from "../config/env";
import { useAuthStore } from "../presentation/stores/authStore";

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
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
