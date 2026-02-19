import { ApiError } from '@/src/infrastructure/http/apiClient';

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as any).message;
    if (typeof msg === 'string' && msg.trim().length > 0) return msg;
  }
  return fallback;
}
