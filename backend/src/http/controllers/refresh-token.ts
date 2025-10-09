import { Request, Response } from 'express';
import { makeRefreshTokenUseCase } from '../../use-cases/factories/make-refresh-token-use-case';

export class RefreshTokenController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token é obrigatório' });
    }

    try {
      const refreshTokenUseCase = makeRefreshTokenUseCase();
      const result = await refreshTokenUseCase.execute({ refreshToken });

      return res.json(result);
    } catch (err: any) {
      return res.status(401).json({ message: err.message || 'Token inválido ou expirado' });
    }
  }
}
