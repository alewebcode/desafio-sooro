import { UsersRepository } from '../repositories/users-repository';

export class GetUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }
}
