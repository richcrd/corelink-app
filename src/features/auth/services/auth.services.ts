import { authRepository } from "../api/auth.repository";
import type {
  LoginCredentials,
  RegisterBody,
  AuthSession,
  AuthResponseDto,
} from "../types/auth";

function mapToSession(dto: AuthResponseDto): AuthSession {
  return {
    token: dto.accessToken,
    user: {
      id: dto.userId,
      personId: dto.personId,
      username: dto.username,
      role: dto.role,
    },
  };
}

export async function loginService(credentials: LoginCredentials): Promise<AuthSession> {

    if (!credentials.username || !credentials.password) {
        throw new Error("El usuario y contraseña son requeridos");
    }
    
    const dto = await authRepository.login(credentials);
    return mapToSession(dto);
};

export async function registerService(body: RegisterBody): Promise<AuthSession> {

    if (!body.username || !body.password || !body.email || !body.firstName || !body.lastName) {
        throw new Error("Complete los campos requeridos");
    }

    const dto = await authRepository.register(body);

    return mapToSession(dto);
}
