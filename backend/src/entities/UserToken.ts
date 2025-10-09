import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity('usuario_token') // nome da tabela
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  refresh_token!: string;

  @Column('text')
  id_usuario!: string;

  @Column('datetime')
  expiracao_token!: Date;

  @CreateDateColumn({ name: 'dt_inclusao' })
  dtInclusao!: Date;

  @ManyToOne(() => User, (user) => user.tokens, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'id_usuario' })
  user!: User;
}
