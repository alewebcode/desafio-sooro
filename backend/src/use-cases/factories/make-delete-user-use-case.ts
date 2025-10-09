import { AppDataSource } from '../../database/data-source';
import { User } from '../../entities/User';
import { TypeOrmUsersRepository } from '../../repositories/typeorm/typeorm-users-repository';
import { DeleteUserUseCase } from '../delete-user-use-case';

export function makeDeleteUserUseCase() {
  const usersRepository = new TypeOrmUsersRepository(AppDataSource.getRepository(User));
  const deleteUserUseCase = new DeleteUserUseCase(usersRepository);

  return deleteUserUseCase;
}
