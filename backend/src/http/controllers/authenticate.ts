import { Request, Response } from 'express';
import { AuthenticateUseCase } from '../../use-cases/authenticate';
import { TypeOrmUsersRepository } from '../../repositories/typeorm/typeorm-users-repository';
import { TypeOrmUsersTokenRepository } from '../../repositories/typeorm/typeorm-users-token-repository';
import { makeAuthenticateUseCase } from '../../use-cases/factories/make-authenticate-use-case';
import z from 'zod';

export class AuthenticateController {
  async login(req: Request, res: Response): Promise<Response> {
    const authenticateBodySchema = z.object({
      user: z.string(),
      password: z.string().min(8),
    });

    const { user, password } = authenticateBodySchema.parse(req.body);

    try {
      const authenticateUseCase = makeAuthenticateUseCase();

      const result = await authenticateUseCase.execute({ user, password });

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}
