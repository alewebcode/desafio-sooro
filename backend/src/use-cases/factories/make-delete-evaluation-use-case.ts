import { AppDataSource } from '../../database/data-source';
import { ImcEvaluation } from '../../entities/ImcEvaluation';
import { TypeOrmEvaluationsRepository } from '../../repositories/typeorm/typeorm-evaluations-repository';
import { DeleteEvaluationUseCase } from '../delete-evaluation-use-case';

export function makeDeleteEvaluationUseCase() {
  const evaluationRepository = new TypeOrmEvaluationsRepository(
    AppDataSource.getRepository(ImcEvaluation),
  );
  const deleteUserUseCase = new DeleteEvaluationUseCase(evaluationRepository);

  return deleteUserUseCase;
}
