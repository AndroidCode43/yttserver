import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { FlightsService } from './flights.service';
import { CreateFlightDto } from "./dto/CreateFlight.dto";
import { TypeGuard } from "../guards/type.guard";
import { Types } from "../decorators/type.decorator";

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Types('ADMIN')
  @UseGuards(TypeGuard)
  @UsePipes(new ValidationPipe())
  @Post('/:id')
  createFlight(@Param('id') id: number, @Body() dto: CreateFlightDto){
    return this.flightsService.createFlight(dto, id);
  }

  @Get('/all')
  getAll(){
    return this.flightsService.getFlights();
  }

  @Get('/all_with_tickets')
  getAllWithTickets(){
    return this.flightsService.getFlightsWithTickets();
  }

  @Delete('/delete/:id')
  deleteFlight(@Param('id') id: number){
    return this.flightsService.deleteFlight(id);
  }

  @Get('/find')
  findFlightByCities(
    @Query('fromCity') fromCity: string,
    @Query('intoCity') intoCity: string
  ){
    return this.flightsService.findFlightByCities(fromCity.toLowerCase(), intoCity.toLowerCase());
  }

  @Get('flight_by_id/:id')
  findById(@Param('id') id: number){
    return this.flightsService.findFlightById(id);
  }

  @Get('/valid')
  validFlights(){
    return this.flightsService.getValidFlights();
  }

  @Get('/find_by_date')
  findFlightByDate(
    @Query('flightDate') flightDate: string
  ){
    return this.flightsService.findFlightByDate(flightDate);
  }

  @Types('ADMIN')
  @UseGuards(TypeGuard)
  @Get('/valid_with_tickets')
  getValidFlightWithTickets(){
    return this.flightsService.getValidFlightsWithTickets();
  }

  // @Get('/sum')
  // getSum(){
  //   return this.flightsService.findAllPriceFlight();
  // }
}