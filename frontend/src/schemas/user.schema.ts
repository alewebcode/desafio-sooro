import { z } from 'zod';

export const userSchema = z.object({
  nome: z.string().min(3),
  usuario: z.string(),
  senha: z.string().min(8),
  perfil: z.enum(['admin', 'professor', 'aluno']),
  situacao: z.enum(['ativo', 'inativo']).optional(),
});

export const editUserSchema = userSchema.extend({
  nome: z.string().min(3).optional(),
  usuario: z.string().optional(),
  senha: z.string().min(8).optional(),
  perfil: z.enum(['admin', 'professor', 'aluno']).optional(),
  situacao: z.enum(['ativo', 'inativo']).optional(),
});

export type EditUserForm = z.infer<typeof editUserSchema>;
export type UserForm = z.infer<typeof userSchema>;
