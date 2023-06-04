import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from './auth.service';
import { LoginUserDto } from "../users/dto/LoginUser.dto";
import { CreateUserDto } from "../users/dto/CreateUser.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('/login')
  login(@Body() dto: LoginUserDto){
    return this.authService.login(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('/registration')
  registration(@Body() dto: CreateUserDto){
    return this.authService.registration(dto);
  }
}
