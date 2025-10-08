import { UsersRepository } from '../repositories/users-repository';
import { Role } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import bcrypt from 'bcryptjs';

export interface UpdateUserRequest {
  nome?: string;
  usuario?: string;
  senha?: string;
  perfil?: Role;
  situacao?: UserStatus;
}

interface PerformedBy {
  id: string;
  role: Role;
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    userIdToUpdate: string,
    payload: UpdateUserRequest,
    options: { performedBy: PerformedBy },
  ) {
    const { performedBy } = options;

    const user = await this.usersRepository.findById(userIdToUpdate);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isAdmin = performedBy.role === Role.ADMIN;

    if (performedBy.role === Role.PROFESSOR && user.perfil !== Role.ALUNO) {
      throw new Error('Você não pode atualizar este usuário');
    }

    // Apenas admin pode alterar role ou status
    if ((payload.perfil || payload.situacao) && !isAdmin) {
      throw new Error('Não autorizado a alterar perfil ou status');
    }

    if (payload.senha) {
      payload.senha = await bcrypt.hash(payload.senha, 8);
    }

    Object.assign(user, payload);

    await this.usersRepository.update(userIdToUpdate, user);

    return {
      id: user.id,
      nome: user.nome,
      usuario: user.usuario,
      perfil: user.perfil,
      situacao: user.situacao,
    };
  }
}
