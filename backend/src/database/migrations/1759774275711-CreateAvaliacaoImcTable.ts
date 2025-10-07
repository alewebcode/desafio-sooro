import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAvaliacaoImcTable1759774275711
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE avaliacao_imc (
          id TEXT PRIMARY KEY NOT NULL,
          altura DECIMAL NOT NULL,
          peso DECIMAL NOT NULL,
          imc DECIMAL NOT NULL,
          classificacao TEXT NOT NULL,
          id_usuario_avaliacao TEXT NOT NULL,
          id_usuario_aluno TEXT NOT NULL,
          dt_inclusao DATETIME NOT NULL,
          FOREIGN KEY (id_usuario_avaliacao) REFERENCES usuario(id)
            ON UPDATE CASCADE
            ON DELETE NO ACTION,
          FOREIGN KEY (id_usuario_aluno) REFERENCES usuario(id)
            ON UPDATE CASCADE
            ON DELETE NO ACTION
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE avaliacao_imc;`);
  }
}
