export enum UserStatus {
  ACTIVE = 'ativo',
  INACTIVE = 'inativo',
}

export const isActive = (status: UserStatus): boolean => {
  return status === UserStatus.ACTIVE;
};
