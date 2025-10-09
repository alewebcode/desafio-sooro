import { Request, Response } from 'express';
import { makeDeleteEvaluationUseCase } from '../../use-cases/factories/make-delete-evaluation-use-case';

export class DeleteEvaluationController {
  async delete(req: Request, res: Response): Promise<Response> {
    const evaluationId = req.params.id;

    if (!evaluationId) {
      return res.status(400).json({ message: 'Id da avaliação não informado' });
    }

    try {
      const deleteEvaluationUseCase = makeDeleteEvaluationUseCase();

      const result = await deleteEvaluationUseCase.execute(evaluationId);

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Erro ao excluir avaliação' });
    }
  }
}
