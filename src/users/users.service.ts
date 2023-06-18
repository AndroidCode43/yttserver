import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/CreateUser.dto";
import { UserEntity } from "./entities/user.entity";
import { BalanceTopUpDto } from "./dto/BalanceTopUp.dto";

@Injectable()
export class UsersService {

  constructor(@InjectRepository(UserEntity)
              private repository: Repository<UserEntity>) {}

  async createUser(dto: CreateUserDto){
    return await this.repository.save({
      ...dto,
      type: 'USER'
    });
  }

  async getAll(){
    return await this.repository.find({
      relations:{
        tickets: true,
      }
    });
  }

  async findUserByEmail(email: string){
    return await this.repository.findOne({
      where: {email: email}
    });
  }

  async findUserById(id: number){
    const find = await this.repository.findOne({
      where: {id: id},
      relations: ['tickets']
    });

    if(!find){
      throw new HttpException('Пользователь с таким id не был найден!', HttpStatus.NOT_FOUND);
    }

    return find;
  }

  async getMe(id: number){
    return await this.findUserById(id);
  }

  async balanceTopUp(dto: BalanceTopUpDto, userId: number){
      const findUser = await this.findUserById(userId);
      await this.repository.update(findUser.id, {
        balance: findUser.balance + dto.amount
      });
      return {
        successful: true
      }
  }

  //функция для списывания баланса пользователя
  async payOutOfBalance(userId: number, amount: number){
    const findUser = await this.findUserById(userId);

    if(findUser.balance < amount){
      throw new HttpException('Не хватает средств для оплаты билета!', HttpStatus.BAD_REQUEST);
    }

    return await this.repository.update(findUser.id, {
      balance: findUser.balance - amount
    });
  }

  async deleteUser(userId: number){
    const findUser = await this.repository.findOne({where: {id: userId}});
    
    if(!findUser){
      throw new HttpException('Такой пользователь не найден!', HttpStatus.BAD_REQUEST);
    }
  
    return await this.repository.delete(findUser);
  }
}