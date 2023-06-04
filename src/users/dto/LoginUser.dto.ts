import { IsEmail, MinLength } from "class-validator";

export class LoginUserDto{
  @IsEmail({},{message: 'Введите корректный email!'})
  readonly email: string;
  @MinLength(8, {message: 'Пароль не должен быть менее 8 символов!'})
  readonly password: string;
}