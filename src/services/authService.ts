import type { User } from "@/src/models/User";
import { api } from "../http/httpClient";
import { ENDPOINTS } from "@/src/http/endpoints";
import { post } from "../http/http";

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterBody = {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  locationId?: string;
  phoneNumber?: string;
  address?: string;
};

export type AuthSession = {
  token: string;
  user: User;
};

type AuthResponseDto = {
  accessToken: string;
  userId: string;
  personId: string;
  username: string;
  role: string;
};

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

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
    const dto = await post<LoginCredentials, AuthResponseDto>(
        ENDPOINTS.auth.login,
        credentials
    );

    return mapToSession(dto);
}

export async function register(body: RegisterBody): Promise<AuthSession> {
    const dto = await post<RegisterBody, AuthResponseDto>(
        ENDPOINTS.auth.register,
        body
    );

    return mapToSession(dto);
}