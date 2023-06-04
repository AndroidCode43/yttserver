import { Injectable } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { FlightsService } from "../flights/flights.service";
import { TicketsService } from "../tikets/tickets.service";
import { PlanesService } from "../planes/planes.service";

@Injectable()
export class InfoService {

  constructor(
    private usersService: UsersService,
    private flightsService: FlightsService,
    private ticketsService: TicketsService,
    private planeService: PlanesService
  ) {}

  async getAllInfo(){
    const users = await this.usersService.getAll();
    const flights = await this.flightsService.getFlights();
    const tickets = await this.ticketsService.getAll();
    const planes = await this.planeService.getAllPlanes();
    const profit = await this.ticketsService.getAllProfit();

    return{
      "profit": profit.sum,
      "ticketsSold": tickets.length,
      "countPlanes": planes.length,
      "countUsers": users.length,
      "countFlights": flights.length
    }
  }

}