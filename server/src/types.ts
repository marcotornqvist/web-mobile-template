import { User } from '@prisma/client';

export type errorsType = { [key: string]: string };

export interface AuthToken {
  authorization: string;
  expiration: number;
}

export interface AuthResponse extends AuthToken {
  user: User;
}
