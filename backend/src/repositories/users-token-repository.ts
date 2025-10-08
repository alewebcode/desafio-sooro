import { UserToken } from '../entities/UserToken';

export interface UsersTokenRepository {
  create(data: UserToken): Promise<UserToken>;
}
