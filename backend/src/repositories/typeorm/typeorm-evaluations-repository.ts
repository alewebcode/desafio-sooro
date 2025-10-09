import { Repository } from 'typeorm';
import { ImcEvaluation } from '../../entities/ImcEvaluation';
import {
  EvaluationsRepository,
  FindEvaluationsOptions,
  FindEvaluationsResult,
} from '../evaluations-repository';

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

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
  private normalizePagination(page?: number, perPage?: number) {
    const p = Math.max(1, page ?? 1);
    const pp = Math.max(1, perPage ?? 10);
    const skip = (p - 1) * pp;
    return { page: p, perPage: pp, skip, take: pp };
  }

  async find(options?: FindEvaluationsOptions): Promise<FindEvaluationsResult> {
    const { page, perPage, skip, take } = this.normalizePagination(options?.page, options?.perPage);

    const qb = this.repository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.student', 'student')
      .leftJoinAndSelect('e.teacher', 'teacher');

    if (options?.studentId) {
      qb.andWhere('e.id_usuario_aluno = :studentId', { studentId: options.studentId });
    }

    if (options?.teacherId) {
      qb.andWhere('e.id_usuario_avaliacao = :teacherId', { teacherId: options.teacherId });
    }

    const [items, total] = await qb
      .orderBy('e.dt_inclusao', 'DESC')
      // .skip(skip)
      // .take(take)
      .getManyAndCount();

    return { items, total, page, perPage };
  }

  async findByStudentId(
    studentId: string,
    options?: Omit<FindEvaluationsOptions, 'studentId'>,
  ): Promise<FindEvaluationsResult> {
    return this.find({ ...options, studentId });
  }

  async findByTeacherId(
    teacherId: string,
    options?: Omit<FindEvaluationsOptions, 'teacherId'>,
  ): Promise<FindEvaluationsResult> {
    return this.find({ ...options, teacherId });
  }
}
