import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { FlightsEntity } from "../../flights/entity/flights.entity";
@Entity('planes')
export class PlaneEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @Column({unique: true})
  description: string;

  @Column()
  numbOfSeats: number;

  @ManyToMany(() => FlightsEntity, (flight) => flight.plane)
  flights: FlightsEntity[]
}