import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, PrimaryColumn, JoinColumn } from "typeorm";
import { PlaneEntity } from "../../planes/entities/plane.entity";
import { TicketEntity } from "../../tikets/entitiy/ticket.entity";

@Entity('flights')
export class FlightsEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  nameFlight: string;

  @Column()
  fromCity: string;

  @Column()
  intoCity: string;

  @Column({type: 'date'})
  flightDate: string;

  @Column()
  flightTime: string;

  @Column()
  arrivalTime: number;

  @Column()
  priceEconomy: number;

  @Column()
  priceBusiness: number;

  @Column()
  pricePremium: number;

  @Column()
  seatsAvailable: number;

  @Column()
  seatsEconomy: number;

  @Column()
  seatsBusiness: number;

  @Column()
  seatsPremium: number;

  @Column({default: true})
  isValid: boolean;

  @ManyToOne(() => PlaneEntity, (plane) => plane.flights, {
    eager: true
  })
  plane: PlaneEntity

  @OneToMany(() => TicketEntity, (ticket) => ticket.flight, {
    onDelete: "CASCADE"
  })
  tickets: TicketEntity[]
}