import { User } from '../entities/User';

export interface UsersRepository {
  findById(id: string): Promise<any | null>;
  findByUser(user: string): Promise<any | null>;
  create(data: Partial<User>): Promise<User>;
  update(id: string, user: User): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(): Promise<User[]>;
  countEvaluationsByStudentId(userId: string): Promise<number>;
}
