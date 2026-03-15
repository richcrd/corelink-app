export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  response: T;
};

export type Api<T> = ApiResponse<T> | T;

export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  if (!value || typeof value !== "object") return false;

  const v = value as Record<string, unknown>;

  return (
    "success" in v && "statusCode" in v && "message" in v && "response" in v
  );
}

export function unwrap<T>(value: Api<T>): T {
  return isApiResponse<T>(value) ? value.response : (value as T);
}
