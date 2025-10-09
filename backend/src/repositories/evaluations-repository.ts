import { ImcEvaluation } from '../entities/ImcEvaluation';

export interface FindEvaluationsOptions {
  page?: number;
  perPage?: number;
  studentId?: string; // filtro opcional
  teacherId?: string; // filtro opcional
}

export interface FindEvaluationsResult {
  items: ImcEvaluation[];
  total: number;
  page: number;
  perPage: number;
}

export interface EvaluationsRepository {
  create(data: Partial<ImcEvaluation>): Promise<ImcEvaluation>;
  findById(id: string): Promise<any | null>;
  update(id: string, evaluation: ImcEvaluation): Promise<ImcEvaluation>;
  delete(id: string): Promise<void>;
  find(options?: FindEvaluationsOptions): Promise<FindEvaluationsResult>;
  findByStudentId(
    studentId: string,
    options?: Omit<FindEvaluationsOptions, 'studentId'>,
  ): Promise<FindEvaluationsResult>;
  findByTeacherId(
    teacherId: string,
    options?: Omit<FindEvaluationsOptions, 'teacherId'>,
  ): Promise<FindEvaluationsResult>;
}
