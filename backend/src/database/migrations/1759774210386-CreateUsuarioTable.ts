import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsuarioTable1759774210386 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE usuario (
        id TEXT PRIMARY KEY NOT NULL,
        nome TEXT NOT NULL,
        usuario TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        perfil TEXT NOT NULL,
        situacao TEXT NOT NULL,
        dt_inclusao DATETIME NOT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE usuario;`);
  }
}
