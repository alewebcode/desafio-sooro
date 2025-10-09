import { Role } from '../enums/user-role.enum';
import { EvaluationsRepository } from '../repositories/evaluations-repository';
import { calculateBMI, classifyBMI } from '../utils/bmi';

export interface UpdateEvaluationRequest {
  altura?: number;
  peso?: number;
}

interface PerformedBy {
  id: string;
  role: Role;
}

export class UpdateEvaluationUseCase {
  constructor(private evaluationRepository: EvaluationsRepository) {}

  async execute(
    evaluationId: string,
    payload: UpdateEvaluationRequest,
    options: { performedBy: PerformedBy },
  ) {
    const { performedBy } = options;

    const evaluation = await this.evaluationRepository.findById(evaluationId);
    if (!evaluation) {
      throw new Error('Avaliação não encontrada');
    }
    // Professores só podem atualizar avaliações que eles mesmos criaram
    if (performedBy.role === Role.PROFESSOR && evaluation.id_usuario_avaliacao !== performedBy.id) {
      throw new Error('Você não pode atualizar esta avaliação');
    }

    const alturaAlterada = payload.altura !== undefined && payload.altura !== evaluation.altura;
    const pesoAlterado = payload.peso !== undefined && payload.peso !== evaluation.peso;

    if (payload.altura !== undefined) evaluation.altura = Number(payload.altura);
    if (payload.peso !== undefined) evaluation.peso = Number(payload.peso);

    if (alturaAlterada || pesoAlterado) {
      const imcRaw = calculateBMI(evaluation.peso, evaluation.altura);

      const imc = Number(imcRaw.toFixed(2));
      const classificacao = classifyBMI(imc);

      evaluation.imc = imc;
      evaluation.classificacao = classificacao;
    }

    const updated = await this.evaluationRepository.update(evaluationId, evaluation);

    return updated;
  }
}
