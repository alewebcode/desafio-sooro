export enum Role {
  ADMIN = 'admin',
  PROFESSOR = 'professor',
  ALUNO = 'aluno',
}

export enum UserStatus {
  ACTIVE = 'ativo',
  INACTIVE = 'inativo',
}

export interface User {
  id: string;
  nome: string;
  usuario: string;
  perfil: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
