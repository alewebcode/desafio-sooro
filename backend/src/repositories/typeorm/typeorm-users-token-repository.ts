import { AppDataSource } from '../../database/data-source';
import { UserToken } from '../../entities/UserToken';
import { UsersTokenRepository } from '../users-token-repository';

export class TypeOrmUsersTokenRepository implements UsersTokenRepository {
  private repository = AppDataSource.getRepository(UserToken);

  async create(data: UserToken): Promise<UserToken> {
    const token = this.repository.create({
      ...data,
    });

    return await this.repository.save(token);
  }
}
