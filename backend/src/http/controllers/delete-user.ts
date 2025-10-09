import { Request, Response } from 'express';
import { makeDeleteUserUseCase } from '../../use-cases/factories/make-delete-user-use-case';

export class DeleteUserController {
  async delete(req: Request, res: Response): Promise<Response> {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: 'Id do usuário não informado' });
    }

    try {
      const deleteUserUseCase = makeDeleteUserUseCase();

      const result = await deleteUserUseCase.execute(userId);

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Erro ao excluir usuário' });
    }
  }
}
