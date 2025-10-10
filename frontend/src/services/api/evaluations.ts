// services/api/evaluations.ts
import { api } from './axios';

export interface Evaluation {
  id: string;
  student: {
    id: string;
    nome: string;
  };
  teacher: {
    id: string;
    nome: string;
  };
  altura: number;
  peso: number;
  imc: number;
  classificacao: string;
  dtInclusao: string;
}

interface EvaluationsResponse {
  success: boolean;
  items: Evaluation[];
}

interface EvaluationResponse {
  success: boolean;
  data: Evaluation;
  message?: string;
}

export const evaluationsAPI = {
  getAll: async (): Promise<Evaluation[]> => {
    const response = await api.get<EvaluationsResponse>('/evaluations');

    return response.data.items;
  },

  getById: async (id: string): Promise<Evaluation> => {
    const response = await api.get<Evaluation>(`/evaluations/${id}`);
    return response.data;
  },

  create: async (payload: Partial<Evaluation>): Promise<Evaluation> => {
    const response = await api.post<EvaluationResponse>('/evaluations', payload);
    return response.data.data;
  },

  update: async (id: string, payload: Partial<Evaluation>): Promise<Evaluation> => {
    const response = await api.put<EvaluationResponse>(`/evaluations/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/evaluations/${id}`);
    return response.data;
  },
};
