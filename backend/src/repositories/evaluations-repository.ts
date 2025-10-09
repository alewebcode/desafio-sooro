import { ImcEvaluation } from '../entities/ImcEvaluation';

export interface EvaluationsRepository {
  create(data: Partial<ImcEvaluation>): Promise<ImcEvaluation>;
}
