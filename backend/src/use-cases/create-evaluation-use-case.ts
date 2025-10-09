import { ImcEvaluation } from '../entities/ImcEvaluation';
import { User } from '../entities/User';
import { EvaluationsRepository } from '../repositories/evaluations-repository';

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

    const imc = payload.peso / (payload.altura * payload.altura);

    const classificacao = this.classificarIMC(imc);
    const altura = parseFloat(payload.altura.toFixed(2));
    const peso = parseFloat(payload.peso.toFixed(2));

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

  private classificarIMC(imc: number): string {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 24.9) return 'Peso normal';
    if (imc < 29.9) return 'Sobrepeso';
    if (imc < 34.9) return 'Obesidade grau I';
    if (imc < 39.9) return 'Obesidade grau II';
    return 'Obesidade grau III';
  }
}
