// src/use-cases/factories/make-get-evaluations-use-case.ts

import { AppDataSource } from '../../database/data-source';
import { ImcEvaluation } from '../../entities/ImcEvaluation';
import { TypeOrmEvaluationsRepository } from '../../repositories/typeorm/typeorm-evaluations-repository';
import { ListEvaluationUseCase } from '../list-evaluation-use-case';

export function makeListEvaluationUseCase() {
  const evaluationRepository = new TypeOrmEvaluationsRepository(
    AppDataSource.getRepository(ImcEvaluation),
  );
  const getEvaluationUseCase = new ListEvaluationUseCase(evaluationRepository);

  return getEvaluationUseCase;
}
