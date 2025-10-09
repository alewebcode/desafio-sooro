import { Request, Response } from 'express';
import { makeGetUserUseCase } from '../../use-cases/factories/make-get-user-use-case';

export class GetUserController {
  async show(req: Request, res: Response): Promise<Response> {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: 'Id do usuário não informado' });

    try {
      const getUserUseCase = makeGetUserUseCase();
      const user = await getUserUseCase.execute(userId);
      return res.json(user);
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
}
