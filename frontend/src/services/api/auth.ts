import { api } from './axios';

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  userAuthenticated: {
    id: string;
    name: string;
    role: 'admin' | 'professor' | 'aluno';
    status: 'ativo' | 'inativo';
  };
};

export const authAPI = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/authenticate', { user: username, password });
    return data;
  },

  logout: async () => {
    const { data } = await api.post('/logout');
    return data;
  },

  refresh: async (refreshToken: string) => {
    const { data } = await api.post('/refresh', { refreshToken });
    return data;
  },
};
