import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from "./dto/CreateTicket.dto";
import { UserId } from "../decorators/user-id.decorator";
import { TypeGuard } from "../guards/type.guard";
import { Types } from "../decorators/type.decorator";


@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UsePipes(new ValidationPipe())
  @Post('/create_ticket/:id')
  createTickets(@Body() dto: CreateTicketDto,
                @Param('id') id: number){

    return this.ticketsService.createTicket(dto, id);
  }

  @Get('/all')
  getAll(){
    return this.ticketsService.getAll();
  }

  @Delete('/delete_by_id/:id')
  deleteTicket(@Param('id') id: number){
    return this.ticketsService.deleteTicket(id);
  }

  @Types('USER')
  @UseGuards(TypeGuard)
  @Post('/buy_ticket')
  buyTicket(@UserId() id: number,
            @Query('seatType') seatType: string,
            @Query('flightId') flightId: number){
    return this.ticketsService.buyTicket(id, seatType, flightId);
  }

  @Get('/get_by_id/:id')
  getTicket(@Param('id') id: number){
    return this.ticketsService.getTicket(id);
  }

  @UseGuards(TypeGuard)
  @Types('ADMIN')
  @Delete('/delete_all')
  deleteAllTickets(){
    return this.ticketsService.deleteAllTickets();
  }

  @Get('/get_by_date')
  @UseGuards(TypeGuard)
  @Types('ADMIN')
  getTicketsByDate(
    @Query('date') date: string
  ){
    return this.ticketsService.getTicketsByDate(date);
  }

  @Get('/today')
  @UseGuards(TypeGuard)
  @Types('ADMIN')
  getTodayTickets(){
    return this.ticketsService.getTicketsCreatedToday();
  }

  @Get('/by_params')
  @UseGuards(TypeGuard)
  @Types('ADMIN')
  getTicketsByParams(
    @Query('userName') userName: string,
    @Query('flightName') flightName: string,
    @Query('flightDate') flightDate: string
  ){
    return this.ticketsService.searchTicketsByParams(userName, flightName, flightDate);
  }
}