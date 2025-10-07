import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsuarioTokenTable1759774233631
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE usuario_token (
        id TEXT PRIMARY KEY NOT NULL,
        refresh_token TEXT NOT NULL,
        id_usuario TEXT NOT NULL,
        expiracao_token DATETIME NOT NULL,
        dt_inclusao DATETIME NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuario(id)
          ON UPDATE CASCADE
          ON DELETE NO ACTION
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE usuario_token;`);
  }
}
