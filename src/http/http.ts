import { api } from "./httpClient";
import type { ApiResponse } from "./types";

export async function post<TRequest, TResponse>(
  url: string,
  body: TRequest,
): Promise<TResponse> {
  const { data } = await api.post<ApiResponse<TResponse>>(url, body);
  return data.response;
}

export async function get<TResponse>(url: string): Promise<TResponse> {
  const { data } = await api.get<ApiResponse<TResponse>>(url);
  return data.response;
}
