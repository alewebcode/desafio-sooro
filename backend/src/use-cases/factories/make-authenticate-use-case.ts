import { AppDataSource } from '../../database/data-source';
import { User } from '../../entities/User';
import { UserToken } from '../../entities/UserToken';
import { TypeOrmUsersRepository } from '../../repositories/typeorm/typeorm-users-repository';
import { TypeOrmUsersTokenRepository } from '../../repositories/typeorm/typeorm-users-token-repository';
import { AuthenticateUseCase } from '../authenticate';

export function makeAuthenticateUseCase() {
  const userRepository = new TypeOrmUsersRepository(AppDataSource.getRepository(User));
  const userToken = new TypeOrmUsersTokenRepository(AppDataSource.getRepository(UserToken));
  const authenticateUseCase = new AuthenticateUseCase(userRepository, userToken);

  return authenticateUseCase;
}
