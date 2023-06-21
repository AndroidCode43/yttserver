import { IsDateString, IsEmail, MinLength } from "class-validator";

export class CreateUserDto{

  @IsEmail()
  readonly email: string;

  @MinLength(8,{message: 'Пароль должен быть более 8 символов!'})
  readonly password: string;

  @MinLength(3, {message: 'ФИО не должно содержать менее 5 символов!'})
  readonly name: string;

  @MinLength(3, {message: 'Номер паспорта должен быть равен 10 символам!'})
  readonly passportNumber: string;

  @IsDateString()
  readonly dob: string;
}