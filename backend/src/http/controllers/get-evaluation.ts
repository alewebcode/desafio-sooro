import { Request, Response } from 'express';
import { makeGetEvaluationUseCase } from '../../use-cases/factories/make-get-evaluation-use-case';

export class GetEvaluationController {
  async show(req: Request, res: Response): Promise<Response> {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: 'Id da avaliação não informado' });

    try {
      const getUserUseCase = makeGetEvaluationUseCase();
      const user = await getUserUseCase.execute(userId);
      return res.json(user);
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
}
