import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinTable,
  JoinColumn,
  CreateDateColumn
} from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";
import { IsNotEmpty } from "class-validator";
import { FlightsEntity } from "../../flights/entity/flights.entity";

@Entity('tickets')
export class TicketEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  passengerName: string;

  @Column()
  @IsNotEmpty()
  passengerPassport: string;

  @Column()
  @IsNotEmpty()
  seatType: string;

  @Column()
  @IsNotEmpty()
  seatNumber: number;

  @ManyToOne(() => UserEntity, (user) => user.tickets)
  users: UserEntity;

  @IsNotEmpty()
  @Column({default: 0})
  price: number;

  @ManyToOne(() => FlightsEntity, (flight) => flight.tickets ,{
    onDelete: "CASCADE",
    eager: true
  })
  flight: FlightsEntity;

  @CreateDateColumn()
  created_at: Date;
}