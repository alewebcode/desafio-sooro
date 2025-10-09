import { AppDataSource } from '../../database/data-source';
import { User } from '../../entities/User';
import { TypeOrmUsersRepository } from '../../repositories/typeorm/typeorm-users-repository';
import { GetUserUseCase } from '../get-user-use-case';

export function makeGetUserUseCase() {
  const usersRepository = new TypeOrmUsersRepository(AppDataSource.getRepository(User));
  const getUserUseCase = new GetUserUseCase(usersRepository);

  return getUserUseCase;
}
