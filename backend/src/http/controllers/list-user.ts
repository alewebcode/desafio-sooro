import { Response } from 'express';
import { makeListUserUseCase } from '../../use-cases/factories/make-list-user-use-case';

export class ListUserController {
  async list(req: Request, res: Response): Promise<Response> {
    try {
      const listUserUseCase = makeListUserUseCase();
      const { users } = await listUserUseCase.execute();

      return res.json(users);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Erro ao listar usuários' });
    }
  }
}
