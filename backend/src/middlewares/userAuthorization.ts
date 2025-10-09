import { Request, Response, NextFunction } from 'express';
import { Role } from '../enums/user-role.enum';

export function authorizeCreateUser() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }
    if (req.user?.role === Role.ALUNO) {
      return res.status(403).json({ message: 'Alunos não possuem permissão para criar usuários.' });
    }

    next();
  };
}

export function authorizeDeleteUser() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }
    if (req.user?.role !== Role.ADMIN) {
      return res
        .status(403)
        .json({ message: 'Apenas administradores possuem permissão para deletar usuários.' });
    }

    next();
  };
}

export function authorizeListUser() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }
    if (req.user?.role === Role.ALUNO) {
      return res.status(403).json({ message: 'Aluno não possui permissão para listar usuários.' });
    }

    next();
  };
}
