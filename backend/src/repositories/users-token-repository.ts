import { UserToken } from '../entities/UserToken';

export interface UsersTokenRepository {
  create(data: UserToken): Promise<UserToken>;
  findByRefreshToken(refreshToken: string): Promise<UserToken | null>;
  deleteByRefreshToken(refreshToken: string): Promise<void>;
}
