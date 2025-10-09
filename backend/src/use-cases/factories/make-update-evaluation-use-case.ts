import { AppDataSource } from '../../database/data-source';
import { ImcEvaluation } from '../../entities/ImcEvaluation';
import { TypeOrmEvaluationsRepository } from '../../repositories/typeorm/typeorm-evaluations-repository';
import { UpdateEvaluationUseCase } from '../update-evaluation-use-case';

export function makeUpdateEvaluationUseCase() {
  const evaluationRepository = new TypeOrmEvaluationsRepository(
    AppDataSource.getRepository(ImcEvaluation),
  );
  const updateEvaluationUseCase = new UpdateEvaluationUseCase(evaluationRepository);

  return updateEvaluationUseCase;
}
