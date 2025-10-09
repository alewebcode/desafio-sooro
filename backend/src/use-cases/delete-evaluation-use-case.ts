import { EvaluationsRepository } from '../repositories/evaluations-repository';

export class DeleteEvaluationUseCase {
  constructor(private evaluationRepository: EvaluationsRepository) {}

  async execute(evaluationId: string) {
    const evaluation = await this.evaluationRepository.findById(evaluationId);
    if (!evaluation) {
      throw new Error('Avaliação não encontrada');
    }

    await this.evaluationRepository.delete(evaluationId);
  }
}
