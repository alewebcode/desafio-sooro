import { UsersRepository } from '../repositories/users-repository';

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userIdToDelete: string) {
    const user = await this.usersRepository.findById(userIdToDelete);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    await this.usersRepository.delete(userIdToDelete);
  }
}
