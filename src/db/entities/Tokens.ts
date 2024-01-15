import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity("tokens")
export class Tokens extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: "userTokenId",
    referencedColumnName: "id",
  })
  user: User;

  @Column()
  refreshToken: string;
}
