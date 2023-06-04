import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TicketEntity } from "../../tikets/entitiy/ticket.entity";

@Entity('users')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column()
  passportNumber: string;

  @Column({type: 'date'})
  dob: string;

  @Column()
  type: string;

  @Column({default: 0})
  balance: number;

  @OneToMany(() => TicketEntity,
    (ticket) => ticket.users)
  tickets: TicketEntity[]
}