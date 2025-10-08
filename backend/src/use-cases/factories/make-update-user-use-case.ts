import { AppDataSource } from '../../database/data-source';
import { User } from '../../entities/User';
import { TypeOrmUsersRepository } from '../../repositories/typeorm/typeorm-users-repository';
import { UpdateUserUseCase } from '../update-user-use-case';

export function makeUpdateUserUseCase() {
  const usersRepository = new TypeOrmUsersRepository(AppDataSource.getRepository(User));
  const updateUserUseCase = new UpdateUserUseCase(usersRepository);

  return updateUserUseCase;
}
