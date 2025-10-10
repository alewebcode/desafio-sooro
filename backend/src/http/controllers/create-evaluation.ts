import { Request, Response } from 'express';
import z from 'zod';
import { makeCreateEvaluationUseCase } from '../../use-cases/factories/make-create-evaluation-use-case';

export class CreateEvaluationController {
  async create(req: Request, res: Response): Promise<Response> {
    const createBodySchema = z.object({
      altura: z.number(),
      peso: z.number(),
      id_usuario_aluno: z.string(),
    });

    const parsed = createBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Validation failed', errors: parsed.error });
    }
    const payload = parsed.data;

    const currentUser = req.user!;
    console.log(currentUser);

    try {
      const evaluationUseCase = makeCreateEvaluationUseCase();

      const result = await evaluationUseCase.execute(payload, {
        performedBy: { id: currentUser.id },
      });

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}
