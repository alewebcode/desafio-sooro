import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "./User.js";

@Entity("usuario_token") // nome da tabela
export class UserToken {
  @PrimaryColumn("text")
  id!: string;

  @Column("text")
  refresh_token!: string;

  @Column("text")
  id_usuario!: string;

  @Column("datetime")
  expiracao_token!: Date;

  @CreateDateColumn({ name: "dt_inclusao" })
  dtInclusao!: Date;

  @ManyToOne(() => User, (user) => user.tokens, {
    onUpdate: "CASCADE",
    onDelete: "NO ACTION",
  })
  @JoinColumn({ name: "id_usuario" })
  user!: User;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
