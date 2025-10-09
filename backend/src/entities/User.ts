import { Entity, Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserToken } from './UserToken';
import { ImcEvaluation } from './ImcEvaluation';

@Entity('usuario')
export class User {
  @PrimaryGeneratedColumn('uuid')
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
}
