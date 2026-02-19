let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function setApiAuthToken(token: string | null): void {
  authToken = token;
}

export function getApiAuthToken(): string | null {
  return authToken;
}

export function setApiUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export function notifyUnauthorized(): void {
  unauthorizedHandler?.();
}
