import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("message")
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: number;

  @Column()
  recipientId: number;

  @Column()
  createdAt: Date;

  @Column()
  message: string;

  // @ManyToOne(() => User, (user) => user.sentMassages)
  // @JoinColumn({ name: "senderId" })
  // sender: User;

  // @ManyToOne(() => User, (user) => user.receivedMassages)
  // @JoinColumn({ name: "recipientId" })
  // recipient: User;
}
