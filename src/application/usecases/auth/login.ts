import type {
  AuthRepository,
  AuthSession,
  LoginCredentials,
} from '@/src/domain/repositories/AuthRepository';

export async function loginUseCase(
  repo: AuthRepository,
  credentials: LoginCredentials,
): Promise<AuthSession> {
  return repo.login(credentials);
}
