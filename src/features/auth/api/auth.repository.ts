import axios from "axios";
import { post } from "@/src/shared/http/http";
import { requests } from "@/src/shared/http/endpoints";
import { ENV } from "@/src/config/env";
import { isApiResponse } from "@/src/shared/http/types";
import type {
  LoginCredentials,
  RegisterBody,
  AuthResponseDto,
} from "../types/auth";

export type RefreshResponseDto = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
};

const plainAxios = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { Accept: "application/json" },
});

export const authRepository = {
  login: (body: LoginCredentials) =>
    post<LoginCredentials, AuthResponseDto>(requests.auth.login, body),

  register: (body: RegisterBody) =>
    post<RegisterBody, AuthResponseDto>(requests.auth.register, body),

  async refresh(refreshToken: string): Promise<RefreshResponseDto> {
    const { data } = await plainAxios.post(requests.auth.refresh, {
      refreshToken,
    });
    return isApiResponse<RefreshResponseDto>(data) ? data.response : data;
  },
};
