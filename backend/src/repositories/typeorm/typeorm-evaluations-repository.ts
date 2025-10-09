import { Repository } from 'typeorm';
import { ImcEvaluation } from '../../entities/ImcEvaluation';
import { EvaluationsRepository } from '../evaluations-repository';

export class TypeOrmEvaluationsRepository implements EvaluationsRepository {
  constructor(private repository: Repository<ImcEvaluation>) {}

  async create(data: Partial<ImcEvaluation>): Promise<ImcEvaluation> {
    return this.repository.save(data);
  }
}
