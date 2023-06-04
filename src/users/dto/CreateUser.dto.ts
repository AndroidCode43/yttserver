import { IsEmail, MinLength } from "class-validator";

export class CreateUserDto{

  @IsEmail()
  readonly email: string;

  @MinLength(8,{message: 'Пароль должен быть более 8 символов!'})
  readonly password: string;
  readonly name: string;
  readonly passportNumber: string;
  readonly dob: string;
}