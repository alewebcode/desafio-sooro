import { ImcEvaluation } from '../entities/ImcEvaluation';

export interface EvaluationsRepository {
  create(data: Partial<ImcEvaluation>): Promise<ImcEvaluation>;
  findById(id: string): Promise<any | null>;
  update(id: string, evaluation: ImcEvaluation): Promise<ImcEvaluation>;
}
