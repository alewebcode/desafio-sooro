import { AppDataSource } from '../../database/data-source';
import { User } from '../../entities/User';
import { TypeOrmUsersRepository } from '../../repositories/typeorm/typeorm-users-repository';
import { RegisterUseCase } from '../register';

export function makeRegisterUseCase() {
  const userRepo = new TypeOrmUsersRepository(AppDataSource.getRepository(User));
  const registerUseCase = new RegisterUseCase(userRepo);

  return registerUseCase;
}
