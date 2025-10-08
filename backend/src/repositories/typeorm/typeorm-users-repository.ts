import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { User } from '../../entities/User';
import { UsersRepository } from '../users-repository';

export class TypeOrmUsersRepository implements UsersRepository {
  constructor(private repository: Repository<User>) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { id },
      relations: ['tokens'],
    });
    return user;
  }

  async findByUser(user: string): Promise<User | null> {
    const userFound = await this.repository.findOne({
      where: { usuario: user },
      relations: ['tokens'],
    });

    return userFound;
  }

  async create(data: Partial<User>): Promise<User> {
    const user = new User();
    user.nome = data.nome!;
    user.usuario = data.usuario!;
    user.senha = data.senha!;
    user.perfil = data.perfil!;
    user.situacao = 'ativo';

    return this.repository.save(user);
  }
  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Atualiza apenas os campos fornecidos
    Object.assign(user, data);

    return this.repository.save(user);
  }
}
