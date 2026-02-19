import { ENV } from "@/src/infrastructure/config/env";
import {
  getApiAuthToken,
  notifyUnauthorized,
} from "@/src/infrastructure/http/authRuntime";

import {
  buildFetchInit,
  buildRequestContext,
  getErrorMessageFromPayload,
  parsePayload,
  runErrorInterceptors,
  runRequestInterceptors,
  runResponseInterceptors,
} from "./apiInternals";

export type {
  ApiErrorInfo,
  ApiInterceptor,
  ApiRequestContext,
  ApiResponseContext,
  HttpMethod,
  RequestOptions,
} from "./apiTypes";

import type {
  ApiErrorInfo,
  ApiInterceptor,
  ApiResponseContext,
  HttpMethod,
  RequestOptions,
} from "./apiTypes";

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

const interceptors: ApiInterceptor[] = [];

export function addApiInterceptor(interceptor: ApiInterceptor): () => void {
  interceptors.push(interceptor);
  return () => {
    const idx = interceptors.indexOf(interceptor);
    if (idx >= 0) interceptors.splice(idx, 1);
  };
}

export async function apiRequest<T>(
  method: HttpMethod,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const requestCtx = buildRequestContext({
    method,
    path,
    options,
    baseUrl: ENV.API_BASE_URL,
    getFallbackToken: getApiAuthToken,
    now: Date.now,
  });
  await runRequestInterceptors(interceptors, requestCtx);

  try {
    const response = await fetch(requestCtx.url, buildFetchInit(requestCtx));

    const payload = await parsePayload(response);

    if (response.status === 401) {
      notifyUnauthorized();
    }

    if (!response.ok) {
      throw new ApiError({
        status: response.status,
        message: getErrorMessageFromPayload(payload, response.status),
        details: payload,
      });
    }

    const responseCtx: ApiResponseContext<T> = {
      request: requestCtx,
      response,
      data: payload as T,
    };

    await runResponseInterceptors(interceptors, responseCtx);

    return payload as T;
  } catch (error) {
    await runErrorInterceptors(interceptors, requestCtx, error);
    throw error;
  }
}
