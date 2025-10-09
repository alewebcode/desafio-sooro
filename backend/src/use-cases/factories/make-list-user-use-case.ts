import { AppDataSource } from '../../database/data-source';
import { User } from '../../entities/User';
import { TypeOrmUsersRepository } from '../../repositories/typeorm/typeorm-users-repository';
import { ListUserUseCase } from '../list-user-use-case';

export function makeListUserUseCase() {
  const usersRepository = new TypeOrmUsersRepository(AppDataSource.getRepository(User));
  const listUserUseCase = new ListUserUseCase(usersRepository);

  return listUserUseCase;
}
