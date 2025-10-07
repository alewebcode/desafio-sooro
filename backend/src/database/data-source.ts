import { DataSource } from "typeorm";

export const DatabaseConfig = new DataSource({
  type: "sqlite",
  database: process.env.DB_PATH || "./database.sqlite",
  entities: ["./src/entities/*.ts"],
  migrations: ["./src/database/migrations/*.ts"],
});
