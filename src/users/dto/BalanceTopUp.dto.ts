import { IsCreditCard, IsNotEmpty, IsNumber, IsString, Length, Max, Min } from "class-validator";

export class BalanceTopUpDto{
  @Length(8, 16, {message: 'Введите валидный номер карты!'})
  @IsString()
  readonly cardNumber: string;

  @Length(5, 5, {message: 'Введите валидную дату карты!'})
  readonly date: string;

  @Length(3,3,{message: 'Введите валидный код!'})
  readonly cvv: string;

  @IsNotEmpty()
  @Min(100, {message: 'Минимальная сумма пополнения 100 рублей!'})
  @Max(1000000, {message: 'Максимальная сумма пополнения 1 000 000 рублей!'})
  @IsNumber()
  readonly amount: number;
}