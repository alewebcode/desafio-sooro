import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { UserToken } from './UserToken';
import { ImcEvaluation } from './ImcEvaluation';

@Entity('usuario')
export class User {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  nome!: string;

  @Column('text', { unique: true })
  usuario!: string;

  @Column('text')
  senha!: string;

  @Column('text')
  perfil!: 'admin' | 'professor' | 'aluno';

  @Column('text')
  situacao!: 'ativo' | 'inativo';

  @CreateDateColumn({ name: 'dt_inclusao' })
  dtInclusao!: Date;

  @OneToMany(() => UserToken, (token) => token.user)
  tokens!: UserToken[];

  @OneToMany(() => ImcEvaluation, (avaliacao) => avaliacao.teacher)
  avaliacoesFeitas!: ImcEvaluation[];

  @OneToMany(() => ImcEvaluation, (avaliacao) => avaliacao.student)
  avaliacoesRecebidas!: ImcEvaluation[];

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
