export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiErrorInfo = {
  status: number;
  message: string;
  details?: unknown;
};

export type RequestOptions = {
  token?: string | null;
  body?: unknown;
  headers?: Record<string, string>;
};

export type ApiRequestContext = {
  method: HttpMethod;
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
