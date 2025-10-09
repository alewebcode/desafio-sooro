import { Request, Response, NextFunction } from 'express';
import { Role } from '../enums/user-role.enum';

export function authorizeCreateEvaluation() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }
    if (req.user?.role === Role.ALUNO) {
      return res
        .status(403)
        .json({ message: 'Alunos não possuem permissão para criar avaliações.' });
    }

    next();
  };
}

export function authorizeUpdateEvaluation() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }
    if (req.user?.role === Role.ALUNO) {
      return res
        .status(403)
        .json({ message: 'Alunos não possuem permissão para editar avaliações.' });
    }

    next();
  };
}

export function authorizeDeleteEvaluation() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }
    if (req.user?.role !== Role.ADMIN) {
      return res
        .status(403)
        .json({ message: 'Apenas administradores possuem permissão para excluir avaliações.' });
    }

    next();
  };
}
