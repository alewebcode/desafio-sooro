import { verify, sign } from 'jsonwebtoken';
import { UsersTokenRepository } from '../repositories/users-token-repository';

export class RefreshTokenUseCase {
  constructor(private userTokenRepository: UsersTokenRepository) {}

  async execute({ refreshToken }: { refreshToken: string }) {
    const tokenFound = await this.userTokenRepository.findByRefreshToken(refreshToken);
    if (!tokenFound) {
      throw new Error('Refresh token inválido');
    }

    const decoded = verify(refreshToken, process.env.REFRESH_SECRET!) as { userId: string };

    await this.userTokenRepository.deleteByRefreshToken(refreshToken);

    const newAccessToken = sign({ sub: decoded.userId }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    const newRefreshToken = sign({ userId: decoded.userId }, process.env.REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    await this.userTokenRepository.create({
      id: crypto.randomUUID(),
      id_usuario: decoded.userId,
      refresh_token: refreshToken,
      expiracao_token: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      dtInclusao: new Date(),
      user: tokenFound.user,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
