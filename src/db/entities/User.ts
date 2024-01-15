import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column({
    type: "simple-array",
    nullable: true,
  })
  sentMassages: string[];

  @Column({
    type: "simple-array",
    nullable: true,
  })
  receivedMassages: string[];
}
