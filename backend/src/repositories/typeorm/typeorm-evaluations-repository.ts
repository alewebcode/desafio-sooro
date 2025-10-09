import { Repository } from 'typeorm';
import { ImcEvaluation } from '../../entities/ImcEvaluation';
import { EvaluationsRepository } from '../evaluations-repository';

export class TypeOrmEvaluationsRepository implements EvaluationsRepository {
  constructor(private repository: Repository<ImcEvaluation>) {}

  async create(data: Partial<ImcEvaluation>): Promise<ImcEvaluation> {
    return this.repository.save(data);
  }
  async findById(id: string): Promise<ImcEvaluation | null> {
    const evaluation = await this.repository.findOne({
      where: { id },
      relations: ['student', 'teacher'],
    });
    return evaluation;
  }

  async update(id: string, data: Partial<ImcEvaluation>): Promise<ImcEvaluation> {
    const evaluation = await this.findById(id);
    if (!evaluation) {
      throw new Error('Avaliação não encontrada');
    }

    Object.assign(evaluation, data);

    return this.repository.save(evaluation);
  }
}
