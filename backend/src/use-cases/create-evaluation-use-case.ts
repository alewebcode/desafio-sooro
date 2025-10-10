import { ImcEvaluation } from '../entities/ImcEvaluation';
import { EvaluationsRepository } from '../repositories/evaluations-repository';
import { calculateBMI, classifyBMI } from '../utils/bmi';

interface EvaluationRequest {
  altura: number;
  peso: number;
  id_usuario_aluno: string;
}

interface PerformedBy {
  id: string;
}

export class CreateEvaluationUseCase {
  constructor(private evaluationRepository: EvaluationsRepository) {}

  async execute(
    payload: EvaluationRequest,
    options: { performedBy: PerformedBy },
  ): Promise<ImcEvaluation> {
    const { performedBy } = options;

    const imc = calculateBMI(payload.peso, payload.altura);

    const classificacao = classifyBMI(imc);
    const altura = parseFloat(payload.altura.toFixed(2));
    const peso = parseFloat(payload.peso.toFixed(2));
    console.log(performedBy.id);
    const evaluation = await this.evaluationRepository.create({
      altura,
      peso,
      imc: parseFloat(imc.toFixed(2)),
      classificacao,
      id_usuario_aluno: payload.id_usuario_aluno,
      id_usuario_avaliacao: performedBy.id,
    });

    return evaluation;
  }
}
