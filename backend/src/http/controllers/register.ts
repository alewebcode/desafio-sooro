import { Request, Response } from 'express';
import z from 'zod';
import { RegisterRequest } from '../../use-cases/register';
import { makeRegisterUseCase } from '../../use-cases/factories/make-register-use-case';
import { Role } from '../../enums/user-role.enum';

export class RegisterController {
  async register(req: Request, res: Response): Promise<Response> {
    const registerBodySchema = z.object({
      nome: z.string().min(3),
      usuario: z.string(),
      senha: z.string().min(8),
      perfil: z.enum([Role.ADMIN, Role.PROFESSOR, Role.ALUNO]),
    });

    const parsed = registerBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Validation failed', errors: parsed.error });
    }
    const payload: RegisterRequest = parsed.data;

    const currentUser = req.user!;

    try {
      const registerUseCase = makeRegisterUseCase();

      const result = await registerUseCase.execute(payload, { userRole: currentUser.role });

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}
