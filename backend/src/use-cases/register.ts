import bcrypt from 'bcryptjs';
import { UsersRepository } from '../repositories/users-repository';
import { User } from '../entities/User';
import { Role, RoleType } from '../enums/user-role.enum';

export interface RegisterRequest {
  nome: string;
  usuario: string;
  senha: string;
  perfil: RoleType;
}

interface UserRole {
  userRole: RoleType;
}

export class RegisterUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(payload: RegisterRequest, actor: UserRole): Promise<User> {
    const hashedPassword = await bcrypt.hash(payload.senha, 8);

    if (actor.userRole === Role.PROFESSOR && payload.perfil !== Role.ALUNO) {
      throw new Error('Professores somente podem criar usuários do tipo aluno.');
    }

    const user = await this.userRepository.create({
      nome: payload.nome,
      usuario: payload.usuario,
      senha: hashedPassword,
      perfil: payload.perfil,
    });

    return user;
  }
}
