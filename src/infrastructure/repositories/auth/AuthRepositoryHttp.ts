import type { User } from '@/src/domain/entities/User';
import type {
  AuthRepository,
  AuthSession,
  LoginCredentials,
  RegisterBody,
} from '@/src/domain/repositories/AuthRepository';

import { apiRequest } from '@/src/infrastructure/http/apiClient';
import { ENDPOINTS } from '@/src/infrastructure/http/endpoints';

type AuthResponseWire = {
  UserId?: string;
  PersonId?: string;
  Username?: string;
  Role?: string;
  AccessToken?: string;
  AccessTokenExpiresAt?: string;
  RefreshToken?: string;
  RefreshTokenExpiresAt?: string;
  userId?: string;
  personId?: string;
  username?: string;
  role?: string;
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function hasAccessToken(obj: unknown): obj is AuthResponseWire {
  if (!isRecord(obj)) return false;
  return typeof obj.AccessToken === 'string' || typeof obj.accessToken === 'string';
}

function unwrapAuthResponse(payload: unknown): AuthResponseWire {
  if (!isRecord(payload)) {
    throw new Error('Respuesta inválida: no es un objeto');
  }

  if (hasAccessToken(payload)) return payload;

  const candidates = [
    payload.response,
    payload.Response,
    payload.data,
    payload.result,
  ];

  for (const c of candidates) {
    if (hasAccessToken(c)) return c;
  }

  // Si no encontramos el token, devolvemos el payload original
  // para que el error sea más informativo al extraer campos.
  return payload as AuthResponseWire;
}

function requiredString(obj: UnknownRecord, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string' && value.trim().length > 0) return value;
  }

  const availableKeys = Object.keys(obj);
  const keysPreview =
    availableKeys.length > 0
      ? availableKeys.slice(0, 20).join(', ')
      : '(sin keys)';
  throw new Error(
    `Respuesta inválida: falta ${keys[0]} (keys: ${keysPreview})`,
  );
}

function extractAuthSession(
  payload: AuthResponseWire,
  fallbackUsername: string,
): AuthSession {
  const record = (payload ?? {}) as UnknownRecord;

  const token = requiredString(record, ['AccessToken', 'accessToken']);
  const userId = requiredString(record, ['UserId', 'userId']);
  const personId = requiredString(record, ['PersonId', 'personId']);
  const username =
    String(payload.Username ?? payload.username ?? fallbackUsername).trim() ||
    fallbackUsername;
  const role = requiredString(record, ['Role', 'role']);

  const user: User = {
    id: userId,
    personId,
    username,
    role,
  };

  return { token, user };
}

export class AuthRepositoryHttp implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const payload = await apiRequest<unknown>('POST', ENDPOINTS.auth.login, {
      body: credentials,
    });
    const auth = unwrapAuthResponse(payload);
    return extractAuthSession(auth, credentials.username);
  }

  async register(body: RegisterBody): Promise<AuthSession> {
    const payload = await apiRequest<unknown>('POST', ENDPOINTS.auth.register, {
      body,
    });
    const auth = unwrapAuthResponse(payload);
    return extractAuthSession(auth, body.username);
  }
}
