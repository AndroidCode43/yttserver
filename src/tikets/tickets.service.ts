import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TicketEntity } from "./entitiy/ticket.entity";
import { Repository } from "typeorm";
import { CreateTicketDto } from "./dto/CreateTicket.dto";
import { FlightsService } from "../flights/flights.service";
import { FlightsEntity } from "../flights/entity/flights.entity";
import { UsersService } from "../users/users.service";
import * as moment from 'moment';

@Injectable()
export class TicketsService {

  constructor(@InjectRepository(TicketEntity)
              private repository: Repository<TicketEntity>,
              private flightsService: FlightsService,
              private usersService: UsersService) {}


  async createTicket(dto: CreateTicketDto, flightId: number){

    const findFlight = await this.flightsService.findFlightById(flightId);

    const tickets = await this.flightsService.getTicketPassportValidByFlightId(flightId, dto.passengerPassport);

    if(tickets.length > 0){
      throw new HttpException('Пользователь с таким паспортом уже купил билет на этот рейс!', HttpStatus.BAD_REQUEST);
    }

    return await this.repository.save({
      ...dto,
      seatNumber: await this.flightsService.updateSeat(dto.seatType, findFlight) + 1,
      flight: {id: findFlight.id},
      price: await this.flightsService.getPriceBySeatType(dto.seatType, findFlight)
    });
  }

  async buyTicket(userId: number, seatType: string, flightId: number){
    const findUser = await this.usersService.findUserById(userId);
    const findFlight = await this.flightsService.findFlightById(flightId);
    const tickets = await this.flightsService.getTicketPassportValidByFlightId(flightId, findUser.passportNumber);

    if(tickets.length > 0){
      throw new HttpException('Пользователь с таким паспортом уже купил билет на этот рейс!', HttpStatus.BAD_REQUEST);
    }

    await this.paymentForTicket(seatType, findUser.id, findFlight);

    return await this.repository.save({
      passengerName: findUser.name,
      passengerPassport: findUser.passportNumber,
      seatType: seatType,
      seatNumber: await this.flightsService.updateSeat(seatType, findFlight) + 1,
      flight: {id: findFlight.id},
      users: {id: findUser.id},
      price: await this.flightsService.getPriceBySeatType(seatType, findFlight)
    });
  }

  async getAll(){
    return await this.repository.find({
      relations: {
        flight: true
      }
    });
  }

  async deleteTicket(id: number){
    const findTicket = await this.repository.findOne({
      where: {id: id}
    });

    if(!findTicket){
      throw new HttpException('Билет с таким id не был найден!', HttpStatus.NOT_FOUND);
    }

    return await this.repository.delete(id);
  }

  async getTicket(id: number){
    const findTicket = await this.repository.findOne({
      where: {id: id},
      relations: {
        flight: true,
        users: true
      }
    });

    if(!findTicket){
      throw new HttpException('Билет с таким id не найден!', HttpStatus.NOT_FOUND);
    }

    return findTicket;
  }

  async paymentForTicket(seatType: string, userId: number, flight: FlightsEntity){
    if(seatType === 'E'){
      return this.usersService.payOutOfBalance(userId, flight.priceEconomy);
    }
    if(seatType === 'B'){
      return this.usersService.payOutOfBalance(userId, flight.priceBusiness);
    }
    if(seatType === 'F'){
      return this.usersService.payOutOfBalance(userId, flight.pricePremium);
    }
  }

  async deleteAllTickets(){
    return this.repository.clear();
  }

  async getTicketsByDate(date: string){
    const tickets = await this.repository.find();
    return tickets.filter((item) => moment(item.created_at).format().includes(date));
  }

  async getTicketsCreatedToday(){
    const tickets = await this.repository.find();
    const todayDate = moment().format().split('T');
    return tickets.filter((item) => moment(item.created_at).format().includes(todayDate[0]));
  }

  async getAllProfit(){
      return await this.repository
        .createQueryBuilder('tickets')
        .select('SUM(tickets.price)').getRawOne();
    }
}