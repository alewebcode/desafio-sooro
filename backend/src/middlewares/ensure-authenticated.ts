import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserStatus } from '../enums/user-status.enum';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não informado' });
  }

  const token = authHeader.split(' ')[1] as string;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token não fornecido. Acesso negado.',
    });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded: any) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado',
        });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token inválido. Acesso negado.',
        });
      }

      if (decoded.status !== UserStatus.ACTIVE) {
        return res.status(403).json({
          success: false,
          message: 'Usuário inativo. Acesso negado.',
        });
      }
    }

    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
      status: decoded.status,
      iat: decoded.iat,
      exp: decoded.exp,
    };

    next();
  });
}
