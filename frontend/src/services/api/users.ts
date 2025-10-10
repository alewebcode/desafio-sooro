import { Role, UserStatus } from '@/app/types/auth';
import { api } from './axios';
import { UserForm } from '@/schemas/user.schema';

interface User {
  id: string;
  nome: string;
  usuario: string;
  perfil: Role;
  situacao: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export const usersAPI = {
  create: async (data: UserForm): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/register', data);
    return response.data;
  },
  getAll: async (): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>('/users');
    return response.data ?? [];
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<UserForm>): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    console.log(data);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
