import { UsersRepository } from '../repositories/users-repository';

export class ListUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute() {
    const users = await this.usersRepository.findAll();

    return { users };
  }
}
