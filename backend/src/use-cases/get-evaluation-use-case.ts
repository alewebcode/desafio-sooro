import { EvaluationsRepository } from '../repositories/evaluations-repository';

export class GetEvaluationUseCase {
  constructor(private evaluationRepository: EvaluationsRepository) {}

  async execute(evaluationId: string) {
    const user = await this.evaluationRepository.findById(evaluationId);
    if (!user) throw new Error('Avaliação não encontrada');
    return user;
  }
}
