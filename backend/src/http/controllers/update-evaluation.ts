import { Request, Response } from 'express';
import z from 'zod';
import { makeUpdateEvaluationUseCase } from '../../use-cases/factories/make-update-evaluation-use-case';

export class UpdateEvaluationController {
  async update(req: Request, res: Response): Promise<Response> {
    const updateBodySchema = z.object({
      altura: z.number().optional(),
      peso: z.number().optional(),
    });

    const parsed = updateBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: 'Validation failed', errors: parsed.error });
    }
    const payload = parsed.data;

    const evaluationId = req.params.id;
    if (!evaluationId) {
      return res.status(400).json({ message: 'Id da avaliação não informado' });
    }

    try {
      const updateEvaluationUseCase = makeUpdateEvaluationUseCase();
      const currentUser = req.user!;

      const result = await updateEvaluationUseCase.execute(evaluationId, payload, {
        performedBy: { id: currentUser.id, role: currentUser.role },
      });

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Erro ao atualizar avaliação' });
    }
  }
}
