import { Body, Controller, Delete, Get, Post, UseGuards, UsePipes, ValidationPipe, Param, Query} from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto } from "./dto/CreateUser.dto";
import { TypeGuard } from "../guards/type.guard";
import { Types } from "../decorators/type.decorator";
import { UserId } from "../decorators/user-id.decorator";
import { BalanceTopUpDto } from "./dto/BalanceTopUp.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() dto: CreateUserDto){
    return this.usersService.createUser(dto);
  }

  @UseGuards(TypeGuard)
  @Types('ADMIN')
  @Get('/all')
  getAll(){
    return this.usersService.getAll();
  }

  @Get('/admin')
  @UseGuards(TypeGuard)
  @Types('ADMIN')
  isAdmin(@UserId() id: number){
    return this.usersService.findUserById(id);
  }

  @Get('/me')
  @Types('USER','ADMIN')
  @UseGuards(TypeGuard)
  getMe(@UserId() id: number){
    return this.usersService.getMe(id);
  }

  @Types('USER')
  @UseGuards(TypeGuard)
  @Post('/add_balance')
  @UsePipes(new ValidationPipe())
  setBalance(
    @UserId() id: number,
    @Body() dto: BalanceTopUpDto
  ){
    return this.usersService.balanceTopUp(dto, id);
  }

  @UseGuards(TypeGuard)
  @Types('ADMIN')
  @Delete('/delete/:id')
  deleteUser(
    @Param('id') userId: number
    ){
      return this.usersService.deleteUser(userId);
  }

  @Post('/param')
  @UseGuards(TypeGuard)
  @Types('ADMIN')
  findUserByParam(
    @Query('name') name: string,
    @Query('passportNumber') passportNumber: string,
    @Query('dob') dob: string
  ){
    return this.usersService.findUserByParams(name, passportNumber, dob);
  }
}