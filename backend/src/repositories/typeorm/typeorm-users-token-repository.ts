import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { UserToken } from '../../entities/UserToken';
import { UsersTokenRepository } from '../users-token-repository';

export class TypeOrmUsersTokenRepository implements UsersTokenRepository {
  constructor(private repository: Repository<UserToken>) {}

  async create(data: UserToken): Promise<UserToken> {
    const token = this.repository.create({
      ...data,
    });

    return await this.repository.save(token);
  }

  async findByRefreshToken(refreshToken: string): Promise<UserToken | null> {
    const token = await this.repository.findOne({
      where: { refresh_token: refreshToken },
      relations: ['user'],
    });
    return token ?? null;
  }

  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    await this.repository.delete({ refresh_token: refreshToken });
  }
}
