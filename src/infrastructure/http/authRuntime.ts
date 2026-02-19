let token: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setApiAuthToken(newToken: string | null): void {
  token = newToken;
}

export function getApiAuthToken(): string | null {
  return token;
}

export function setApiUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export function notifyUnauthorized(): void {
  onUnauthorized?.();
}
