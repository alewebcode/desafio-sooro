import { Request, Response } from 'express';
import { makeListUserUseCase } from '../../use-cases/factories/make-list-user-use-case';

export class ListUserController {
  async list(req: Request, res: Response): Promise<Response> {
    try {
      const listUserUseCase = makeListUserUseCase();
      const currentUser = req.user!;

      const result = await listUserUseCase.execute();
      let { users } = result;

      // Se o usuário logado for professor, filtra apenas alunos
      if (currentUser.role === 'professor') {
        users = users.filter((user) => user.perfil === 'aluno');
      }

      return res.json(users);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Erro ao listar usuários' });
    }
  }
}
