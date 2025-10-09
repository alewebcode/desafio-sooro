// src/controllers/GetEvaluationsController.ts
import { Request, Response } from 'express';
import z from 'zod';
import { makeGetEvaluationUseCase } from '../../use-cases/factories/make-get-evaluation-use-case';

const querySchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
  studentId: z.string().optional(),
});

export class GetEvaluationController {
  async list(req: Request, res: Response): Promise<Response> {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid query', errors: parsed.error });
    }

    const page = parsed.data.page ? parseInt(parsed.data.page, 10) : 1;
    const perPage = parsed.data.perPage ? parseInt(parsed.data.perPage, 10) : 10;
    const studentId = parsed.data.studentId;

    const currentUser = req.user;
    if (!currentUser) return res.status(401).json({ message: 'Usuário não autenticado' });

    try {
      const getEvaluationsUseCase = makeGetEvaluationUseCase();

      const result = await getEvaluationsUseCase.execute({
        performedBy: { id: currentUser.id, role: currentUser.role },
        page,
        perPage,
        studentId,
      });

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Erro ao buscar avaliações' });
    }
  }
}
