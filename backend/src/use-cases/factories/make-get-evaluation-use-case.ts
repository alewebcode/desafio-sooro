// src/use-cases/factories/make-get-evaluations-use-case.ts

import { AppDataSource } from '../../database/data-source';
import { ImcEvaluation } from '../../entities/ImcEvaluation';
import { TypeOrmEvaluationsRepository } from '../../repositories/typeorm/typeorm-evaluations-repository';
import { GetEvaluationUseCase } from '../get-evaluation-use-case';

export function makeGetEvaluationUseCase() {
  const evaluationRepository = new TypeOrmEvaluationsRepository(
    AppDataSource.getRepository(ImcEvaluation),
  );
  const getEvaluationUseCase = new GetEvaluationUseCase(evaluationRepository);

  return getEvaluationUseCase;
}
