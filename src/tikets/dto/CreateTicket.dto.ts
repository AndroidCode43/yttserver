import { Length, MaxLength, MinLength } from "class-validator";

export class CreateTicketDto{
  @MinLength(2, {message: 'Поле ФИО должно содержать минимум 2 символа!'})
  readonly passengerName: string;

  @Length(10,10, {message: 'Поле серия и номер паспорта должно содержать 10 символов!'})
  readonly passengerPassport: string;

  @Length(1, 1,{message: 'Не выбран класс билета!'})
  readonly seatType: string;
}