import { api } from "./httpClient";
import { unwrap, type Api, type ApiResponse } from "./types";

export async function post<TRequest, TResponse>(
  url: string,
  body: TRequest,
): Promise<TResponse> {
  const { data } = await api.post<Api<TResponse>>(url, body);
  return unwrap<TResponse>(data);
}

export async function get<TResponse>(url: string): Promise<TResponse> {
  const { data } = await api.get<Api<TResponse>>(url);
  return unwrap<TResponse>(data);
}
