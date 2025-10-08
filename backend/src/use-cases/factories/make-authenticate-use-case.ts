import { AppDataSource } from '../../database/data-source';
import { User } from '../../entities/User';
import { TypeOrmUsersRepository } from '../../repositories/typeorm/typeorm-users-repository';
import { TypeOrmUsersTokenRepository } from '../../repositories/typeorm/typeorm-users-token-repository';
import { AuthenticateUseCase } from '../authenticate';

export function makeAuthenticateUseCase() {
  const userRepo = new TypeOrmUsersRepository(AppDataSource.getRepository(User));
  const userToken = new TypeOrmUsersTokenRepository();
  const authenticateUseCase = new AuthenticateUseCase(userRepo, userToken);

  return authenticateUseCase;
}
