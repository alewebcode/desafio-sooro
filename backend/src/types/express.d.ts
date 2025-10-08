// src/types/express.d.ts
import { Role } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name?: string;
        role: Role;
        status: UserStatus;
        iat?: number;
        exp?: number;
      };
    }
  }
}
