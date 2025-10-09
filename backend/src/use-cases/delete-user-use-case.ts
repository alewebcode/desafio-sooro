import { UsersRepository } from '../repositories/users-repository';

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // verifica se o usuário é aluno e possui avaliações vinculadas
    const evaluationsCount = await this.usersRepository.countEvaluationsByStudentId(userId);
    if (evaluationsCount > 0) {
      throw new Error('Não é possível excluir usuário com avaliações vinculadas');
    }

    await this.usersRepository.delete(userId);
  }
}
