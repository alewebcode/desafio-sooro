import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { User } from '../../entities/User';
import { UsersRepository } from '../users-repository';

export class TypeOrmUsersRepository implements UsersRepository {
  constructor(private repository: Repository<User>) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { id },
      relations: ['tokens'],
    });
    return user;
  }

  async findByUser(user: string): Promise<User | null> {
    const userFound = await this.repository.findOne({
      where: { usuario: user },
      relations: ['tokens'],
    });

    return userFound;
  }
}
