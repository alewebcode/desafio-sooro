// src/use-cases/get-evaluations-use-case.ts

import { Role } from '../enums/user-role.enum';
import {
  EvaluationsRepository,
  FindEvaluationsResult,
} from '../repositories/evaluations-repository';

type PerformedBy = { id: string; role: Role };

export class GetEvaluationUseCase {
  constructor(private evaluationsRepository: EvaluationsRepository) {}

  async execute(params: {
    performedBy: PerformedBy;
    page?: number;
    perPage?: number;
    studentId?: string;
  }): Promise<FindEvaluationsResult> {
    const { performedBy, page, perPage, studentId } = params;

    // ADMIN => pode ver tudo (pode aplicar filtro studentId se fornecido)
    if (performedBy.role === Role.ADMIN) {
      return this.evaluationsRepository.find({ page, perPage, studentId });
    }

    // PROFESSOR => ver apenas avaliações que ele realizou (id_usuario_avaliacao)
    if (performedBy.role === Role.PROFESSOR) {
      // se o professor passou studentId, ainda restringe para os alunos dele (via teacherId)
      return this.evaluationsRepository.findByTeacherId(performedBy.id, {
        page,
        perPage,
        studentId,
      });
    }

    // ALUNO => só pode ver suas próprias avaliações
    if (performedBy.role === Role.ALUNO) {
      // se studentId foi passado e for diferente do own id, bloquear ou retornar vazio
      if (studentId && studentId !== performedBy.id) {
        // segurança: aluno só pode ver suas próprias avaliações
        throw new Error('O aluno só pode ver suas próprias avaliações');
      }
      return this.evaluationsRepository.findByStudentId(performedBy.id, { page, perPage });
    }

    throw new Error('Forbidden');
  }
}
