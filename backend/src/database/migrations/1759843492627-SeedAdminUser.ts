import { MigrationInterface, QueryRunner } from 'typeorm';

import { hash } from 'bcryptjs';
import { v4 as uuid } from 'uuid';

export class SeedAdminUser1759843492627 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const id = uuid();
    const senhaHash = await hash('admin123', 8);

    await queryRunner.query(`
          INSERT INTO usuario (id, nome, usuario, senha, perfil, situacao, dt_inclusao)
          VALUES ('${id}', 'Administrador', 'admin', '${senhaHash}', 'admin', 'ativo', datetime('now'));
        `);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM usuario WHERE usuario = 'admin';
          `);
  }
}
