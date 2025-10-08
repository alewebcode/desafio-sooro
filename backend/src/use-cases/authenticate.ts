import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { UsersRepository } from '../repositories/users-repository';
import { UsersTokenRepository } from '../repositories/users-token-repository';

interface UserAuthenticateRequest {
  user: string;
  password: string;
}

export class AuthenticateUseCase {
  constructor(
    private userRepository: UsersRepository,
    private userTokenRepository: UsersTokenRepository,
  ) {}

  async execute({ user, password }: UserAuthenticateRequest) {
    const userFound = await this.userRepository.findByUser(user);

    if (!userFound) {
      throw new Error('Usuário ou senha inválidos');
    }

    if (userFound.situacao !== 'ativo') {
      throw new Error('Usuário inativo');
    }

    const isPasswordValid = await bcrypt.compare(password, userFound.senha);
    if (!isPasswordValid) {
      throw new Error('Usuário ou senha inválidos');
    }

    const accessToken = sign({ userId: userFound.id }, process.env.JWT_SECRET!, {
      expiresIn: '15m',
    });

    const refreshToken = sign({ userId: userFound.id }, process.env.REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    await this.userTokenRepository.create({
      id: crypto.randomUUID(),
      id_usuario: userFound.id,
      refresh_token: refreshToken,
      expiracao_token: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      dtInclusao: new Date(),
      user: userFound,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
