import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { User } from './User';

@Entity('avaliacao_imc')
export class ImcEvaluation {
  @PrimaryColumn('text')
  id!: string;

  @Column('decimal')
  altura!: number;

  @Column('decimal')
  peso!: number;

  @Column('decimal')
  imc!: number;

  @Column('text')
  classificacao!: string;

  @Column('text')
  id_usuario_avaliacao!: string;

  @Column('text')
  id_usuario_aluno!: string;

  @CreateDateColumn({ name: 'dt_inclusao' })
  dtInclusao!: Date;

  @ManyToOne(() => User, (user) => user.avaliacoesFeitas, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'id_usuario_avaliacao' })
  teacher!: User;

  @ManyToOne(() => User, (user) => user.avaliacoesRecebidas, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'id_usuario_aluno' })
  student!: User;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
