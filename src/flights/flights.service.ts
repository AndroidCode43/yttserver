import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { FlightsEntity } from "./entity/flights.entity";
import { CreateFlightDto } from "./dto/CreateFlight.dto";
import { PlanesService } from "../planes/planes.service";
import { UpdateFlightDto } from "./dto/UpdateFlight.dto";
import * as moment from 'moment';

@Injectable()
export class FlightsService {

  constructor(@InjectRepository(FlightsEntity)
              private repository: Repository<FlightsEntity>,
              private planesService: PlanesService) {}

  async createFlight(dto: CreateFlightDto, plane_id: number){
    const findPlane = await this.planesService.findPlaneById(plane_id);
    const findFlightByName = await this.repository.findOne({
      where:{
        nameFlight: dto.nameFlight
      }
    });

    if(!findPlane){
      throw new HttpException('Самолёт с таким id не найден', HttpStatus.NOT_FOUND);
    }

    if(findFlightByName){
      throw new HttpException('Рейс с таким названием уже существует!',HttpStatus.BAD_REQUEST);
    }

    if(dto.seatsAvailable > findPlane.numbOfSeats){
      throw new HttpException('Данный самолёт не расчитан на такое кол-во мест!', HttpStatus.BAD_REQUEST);
    }

    //подсчитывем все места из эконома, бизнесса, первого
    const plusSeats = Number(dto.seatsBusiness) + Number(dto.seatsPremium) + Number(dto.seatsEconomy);

    //проверяем, что все введнные места не привышают доступное кол-во мест
    if(plusSeats > findPlane.numbOfSeats){
      throw new HttpException('Сумма мест по классам превышает доступное кол-во мест!', HttpStatus.BAD_REQUEST);
    }

    return await this.repository.save({
      ...dto,
      plane: findPlane,
    });
  }


  async getFlights(){
    return await this.repository.find({
      relations:{
        plane: true
      }
    });
  }

  async getFlightsByParams(date: String, fromCity: string, intoCity: string){
    const validFlight = await this.getValidFlights();
    return validFlight.filter((flight) => flight.flightDate === date && flight.fromCity.toLowerCase().includes(fromCity) && flight.intoCity.toLowerCase().includes(intoCity));
  }

  //покаызваем только те рейсы, где дата вылета младше текущего выремени
  async getValidFlights(){
    const flights = await this.repository.find();
    return flights.filter(date => moment().isBefore(`${date.flightDate}T${date.flightTime}+03:00`));
  }

  async getValidFlightsWithTickets(){
    const flights = await this.repository.find({
      relations: {
        tickets: true
      }
    });
    return flights.filter(date => moment().isBefore(`${date.flightDate}T${date.flightTime}+03:00`));
  }

  //данную функция предназначена для получения всех рейсов вместе с самолётом
  // и всеми билетами закрепленными за этим рейсом, в отличии от функции getFlights
  async getFlightsWithTickets(){
    return await this.repository.find({
      relations: {
        plane: true,
        tickets: true
      }
    });
  }

  async deleteFlight(id: number){
    const findFlight = await this.repository.findOne({
      where: {id:id}
    });

    if(!findFlight){
      throw new HttpException('Рейс с таким id не был найден!', HttpStatus.NOT_FOUND);
    }

    return await this.repository.delete(id);
  }

  async updateFlight(dto: UpdateFlightDto, flightId: number){
    return await this.repository.update(flightId, dto);
  }

  async findFlightById(id: number){
    const find = await this.repository.findOne({
      where: {id: id}
    });

    if(!find){
      throw new HttpException('Рейс с таким id не найден!', HttpStatus.BAD_REQUEST);
    }

    return find;
  }

  //с помощью этой функции осуществляется поиск паспорта пользователя в выбранном рейсе по его id
  async getTicketPassportValidByFlightId(id: number, passport: string){
    const findTickets = await this.repository.findOne({
      where: {
        id: id,
        tickets: {
          passengerPassport: passport
        }
      },
      relations: {
        tickets: true
      }
    });

    return findTickets?.tickets || [];
  }

  async findFlightByCities(fromCity: string, intoCity: string){

    if(fromCity.length < 1 && intoCity.length < 1){
      return [];
    }

    const find = await this.repository.find();
    return find.filter(flight =>
      flight.fromCity.toLowerCase().includes(fromCity) &&
      flight.intoCity.toLowerCase().includes(intoCity));
  }


  async getPriceBySeatType(seatType, findFlight: FlightsEntity){
    if(seatType === 'E'){
      return findFlight.priceEconomy;
    }
    if(seatType === 'B'){
      return findFlight.priceBusiness;
    }
    if(seatType === 'F'){
      return findFlight.pricePremium;
    }
  }

  async updateSeat(seatType: string, flight: FlightsEntity){
    if(seatType === 'E'){
      if(flight.seatsEconomy === 0){
        throw new HttpException('Нет свободных мест в эконом-классе!', HttpStatus.BAD_REQUEST);
      }
      await this.updateFlight({
        seatsEconomy: flight.seatsEconomy - 1
      }, flight.id);
      const res = await this.findFlightById(flight.id);
      return res.seatsEconomy;
    }

    if(seatType === 'B'){
      if(flight.seatsBusiness === 0){
        throw new HttpException('Нет свободных мест в бизнесс-классе!', HttpStatus.BAD_REQUEST);
      }
      await this.updateFlight({
        seatsBusiness: flight.seatsBusiness - 1
      }, flight.id);
      const res = await this.findFlightById(flight.id);
      return res.seatsBusiness;
    }

    if(seatType === 'F'){
      if(flight.seatsPremium === 0){
        throw new HttpException('Нет свободных мест в первом-классе!', HttpStatus.BAD_REQUEST);
      }
      await this.updateFlight({
        seatsPremium: flight.seatsPremium - 1
      }, flight.id);
      const res = await this.findFlightById(flight.id);
      return res.seatsPremium;
    }
  }

  async findFlightByDate(date: string){
    const flights = await this.repository.find({
      relations: {
        tickets: true
      }
    });
    return flights.filter((flight) => flight.flightDate === date);
  }
}