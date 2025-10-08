export enum Role {
  ADMIN = 'admin',
  PROFESSOR = 'professor',
  ALUNO = 'aluno',
}

export type RoleType = (typeof Role)[keyof typeof Role];
