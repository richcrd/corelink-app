import { post } from "@/src/shared/http/http";
import { ENDPOINTS } from "@/src/shared/http/endpoints";
import type {
  LoginCredentials,
  RegisterBody,
  AuthResponseDto,
} from "../types/auth";

export const authRepository = {
  login: (body: LoginCredentials) =>
    post<LoginCredentials, AuthResponseDto>(
        ENDPOINTS.auth.login, 
        body
    ),
  register: (body: RegisterBody) =>
    post<RegisterBody, AuthResponseDto>(
        ENDPOINTS.auth.register, 
        body
    ),
};
