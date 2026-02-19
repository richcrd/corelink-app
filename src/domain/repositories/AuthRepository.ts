import type { User } from '@/src/domain/entities/User';

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterBody = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  locationId: string;
  phoneNumber: string;
  address: string;
};

export type AuthSession = {
  token: string;
  user: User;
};

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  register(body: RegisterBody): Promise<AuthSession>;
}
