import { AppDataSource } from '../../database/data-source';
import { ImcEvaluation } from '../../entities/ImcEvaluation';
import { TypeOrmEvaluationsRepository } from '../../repositories/typeorm/typeorm-evaluations-repository';
import { CreateEvaluationUseCase } from '../create-evaluation-use-case';

export function makeCreateEvaluationUseCase() {
  const evaluationRepository = new TypeOrmEvaluationsRepository(
    AppDataSource.getRepository(ImcEvaluation),
  );
  const registerUseCase = new CreateEvaluationUseCase(evaluationRepository);

  return registerUseCase;
}
