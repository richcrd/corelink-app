import axios from "axios";

export function getErrorMessage(error: unknown, fallback = "Unexpected error"): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
