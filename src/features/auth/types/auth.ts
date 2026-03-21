import type { User } from "./user";

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
  branchId?: number;
  locationId?: string;
  phoneNumber?: string;
  address?: string;
};

export type AuthSession = {
  token: string;
  refreshToken: string;
  user: User;
};

export type AuthResponseDto = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  userId: string;
  personId: string;
  username: string;
  role: string;
};