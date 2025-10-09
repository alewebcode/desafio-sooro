import { AppDataSource } from '../../database/data-source';
import { UserToken } from '../../entities/UserToken';
import { TypeOrmUsersTokenRepository } from '../../repositories/typeorm/typeorm-users-token-repository';
import { RefreshTokenUseCase } from '../refresh-token-use-case';

export function makeRefreshTokenUseCase() {
  const userTokenRepository = new TypeOrmUsersTokenRepository(
    AppDataSource.getRepository(UserToken),
  );
  const registerUseCase = new RefreshTokenUseCase(userTokenRepository);

  return registerUseCase;
}
