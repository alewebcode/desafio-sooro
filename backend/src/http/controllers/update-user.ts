import { Request, Response } from 'express';
import z from 'zod';
import { Role } from '../../enums/user-role.enum';
import { UserStatus } from '../../enums/user-status.enum';
import { makeUpdateUserUseCase } from '../../use-cases/factories/make-update-user-use-case';

export class UpdateUserController {
  async update(req: Request, res: Response): Promise<Response> {
    const updateBodySchema = z.object({
      nome: z.string().min(3).optional(),
      usuario: z.string().optional(),
      senha: z.string().min(8).optional(),
      perfil: z.enum([Role.ADMIN, Role.PROFESSOR, Role.ALUNO]).optional(),
      situacao: z.enum(UserStatus).optional(),
    });

    const parsed = updateBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: 'Validation failed', errors: parsed.error });
    }
    const payload = parsed.data;

    const userIdToUpdate = req.params.id;
    if (!userIdToUpdate) {
      return res.status(400).json({ message: 'Id do usuário não informado' });
    }

    try {
      const updateUserUseCase = makeUpdateUserUseCase();
      const currentUser = req.user!;

      const result = await updateUserUseCase.execute(userIdToUpdate, payload, {
        performedBy: { id: currentUser.id, role: currentUser.role },
      });

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Erro ao atualizar usuário' });
    }
  }
}
