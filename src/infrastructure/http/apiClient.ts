import { ENV } from "@/src/infrastructure/config/env";
import {
  getApiAuthToken,
  notifyUnauthorized,
} from "@/src/infrastructure/http/authRuntime";

export type ApiErrorInfo = {
  status: number;
  message: string;
  details?: unknown;
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly details?: unknown;

  constructor(info: ApiErrorInfo) {
    super(info.message);
    this.name = "ApiError";
    this.status = info.status;
    this.details = info.details;
  }
}

type RequestOptions = {
  token?: string | null;
  body?: unknown;
  headers?: Record<string, string>;
};

export type ApiRequestContext = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  url: string;
  startedAt: number;
  options: RequestOptions;
  headers: Record<string, string>;
};

export type ApiResponseContext<T = unknown> = {
  request: ApiRequestContext;
  response: Response;
  data: T;
};

export type ApiInterceptor = {
  onRequest?: (ctx: ApiRequestContext) => Promise<void> | void;
  onResponse?: (ctx: ApiResponseContext) => Promise<void> | void;
  onError?: (ctx: {
    request: ApiRequestContext;
    error: unknown;
  }) => Promise<void> | void;
};

const interceptors: ApiInterceptor[] = [];

export function addApiInterceptor(interceptor: ApiInterceptor): () => void {
  interceptors.push(interceptor);
  return () => {
    const idx = interceptors.indexOf(interceptor);
    if (idx >= 0) interceptors.splice(idx, 1);
  };
}

function joinUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function apiRequest<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = joinUrl(ENV.API_BASE_URL, path);

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.body !== undefined
      ? { "Content-Type": "application/json" }
      : {}),
    ...(options.headers ?? {}),
  };

  const token = options.token ?? getApiAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const requestCtx: ApiRequestContext = {
    method,
    path,
    url,
    startedAt: Date.now(),
    options,
    headers,
  };

  for (const interceptor of interceptors) {
    await interceptor.onRequest?.(requestCtx);
  }

  try {
    const response = await fetch(requestCtx.url, {
      method: requestCtx.method,
      headers: requestCtx.headers,
      body:
        requestCtx.options.body !== undefined
          ? JSON.stringify(requestCtx.options.body)
          : undefined,
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson
      ? await response.json().catch(() => undefined)
      : await response.text().catch(() => undefined);

    if (response.status === 401) {
      notifyUnauthorized();
    }

    if (!response.ok) {
      const message =
        (payload &&
          typeof payload === "object" &&
          "message" in (payload as any) &&
          String((payload as any).message)) ||
        `Request failed (${response.status})`;
      throw new ApiError({
        status: response.status,
        message,
        details: payload,
      });
    }

    const responseCtx: ApiResponseContext<T> = {
      request: requestCtx,
      response,
      data: payload as T,
    };

    for (const interceptor of interceptors) {
      await interceptor.onResponse?.(responseCtx);
    }

    return payload as T;
  } catch (error) {
    for (const interceptor of interceptors) {
      await interceptor.onError?.({ request: requestCtx, error });
    }
    throw error;
  }
}
