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
  locationId?: string;
  phoneNumber?: string;
  address?: string;
};

export type AuthSession = {
  token: string;
  user: User;
};

export type AuthResponseDto = {
  accessToken: string;
  userId: string;
  personId: string;
  username: string;
  role: string;
};