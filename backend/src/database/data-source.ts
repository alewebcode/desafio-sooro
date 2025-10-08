import { DataSource } from 'typeorm';
import { ImcEvaluation } from '../entities/ImcEvaluation';
import { UserToken } from '../entities/UserToken';
import { User } from '../entities/User';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_PATH || './database.sqlite',
  entities: [User, UserToken, ImcEvaluation],
  migrations: ['./src/database/migrations/*.ts'],
});
