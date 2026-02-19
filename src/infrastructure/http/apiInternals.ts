import type {
  ApiInterceptor,
  ApiRequestContext,
  ApiResponseContext,
  HttpMethod,
  RequestOptions,
} from "./apiTypes";

export function joinUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

function resolveToken(
  options: RequestOptions,
  getFallbackToken: () => string | null,
): string | null {
  return options.token ?? getFallbackToken();
}

export function buildHeaders(
  options: RequestOptions,
  getFallbackToken: () => string | null,
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.body !== undefined
      ? { "Content-Type": "application/json" }
      : {}),
    ...(options.headers ?? {}),
  };

  const token = resolveToken(options, getFallbackToken);
  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
}

export function buildRequestContext(params: {
  method: HttpMethod;
  path: string;
  options: RequestOptions;
  baseUrl: string;
  getFallbackToken: () => string | null;
  now: () => number;
}): ApiRequestContext {
  return {
    method: params.method,
    path: params.path,
    url: joinUrl(params.baseUrl, params.path),
    startedAt: params.now(),
    options: params.options,
    headers: buildHeaders(params.options, params.getFallbackToken),
  };
}

export async function runRequestInterceptors(
  interceptors: ApiInterceptor[],
  ctx: ApiRequestContext,
): Promise<void> {
  for (const interceptor of interceptors) {
    await interceptor.onRequest?.(ctx);
  }
}

export async function runResponseInterceptors<T>(
  interceptors: ApiInterceptor[],
  ctx: ApiResponseContext<T>,
): Promise<void> {
  for (const interceptor of interceptors) {
    await interceptor.onResponse?.(ctx);
  }
}

export async function runErrorInterceptors(
  interceptors: ApiInterceptor[],
  request: ApiRequestContext,
  error: unknown,
): Promise<void> {
  for (const interceptor of interceptors) {
    await interceptor.onError?.({ request, error });
  }
}

export async function parsePayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (isJson) return await response.json().catch(() => undefined);
  return await response.text().catch(() => undefined);
}

export function getErrorMessageFromPayload(
  payload: unknown,
  status: number,
): string {
  if (payload && typeof payload === "object") {
    if ("message" in (payload as any)) return String((payload as any).message);
  }
  return `Request failed (${status})`;
}

export function buildFetchInit(ctx: ApiRequestContext): RequestInit {
  return {
    method: ctx.method,
    headers: ctx.headers,
    body: ctx.options.body !== undefined ? JSON.stringify(ctx.options.body) : undefined,
  };
}
