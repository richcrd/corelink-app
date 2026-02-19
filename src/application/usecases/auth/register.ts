import type {
  AuthRepository,
  AuthSession,
  RegisterBody,
} from '@/src/domain/repositories/AuthRepository';

export async function registerUseCase(
  repo: AuthRepository,
  body: RegisterBody,
): Promise<AuthSession> {
  return repo.register(body);
}
