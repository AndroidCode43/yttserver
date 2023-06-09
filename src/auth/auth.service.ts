import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "../users/dto/LoginUser.dto";
import * as bcrypt from 'bcryptjs';
import { UserEntity } from "../users/entities/user.entity";
import { find } from "rxjs";
import { CreateUserDto } from "../users/dto/CreateUser.dto";

@Injectable()
export class AuthService {

  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async login(dto: LoginUserDto){
    const findUser = await this.userService.findUserByEmail(dto.email);

    if(!findUser){
      throw new HttpException('Пользователь с таким email не найден!', HttpStatus.NOT_FOUND);
    }

    const passwordEq = await bcrypt.compare(dto.password, findUser.password);

    if(findUser && passwordEq){
      return this.generateJwtToken(findUser);
    }

    throw new HttpException('Неверный логин или пароль!', HttpStatus.BAD_REQUEST);
  }

  async registration(dto: CreateUserDto){
    const findUser = await this.userService.findUserByEmail(dto.email);

    if(findUser){
      throw new HttpException('Пользователь с данными email уже зарегистрирован в системе!',HttpStatus.BAD_REQUEST);
    }

    const hashPass = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.createUser({
      ...dto,
      password: hashPass
    });

    return this.generateJwtToken(user);
  }

  private async generateJwtToken(user: UserEntity){
    return {
      token: this.jwtService.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        passportNumber: user.passportNumber,
        dob: user.dob,
        type: user.type
      }),
      role: user.type
    }
  }
}