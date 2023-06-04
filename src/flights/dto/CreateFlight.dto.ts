import { IsNotEmpty, Min, MinLength } from "class-validator";

export class CreateFlightDto{

  @MinLength(2,{message:'Поле название рейса должно содержать более 2х символов!'})
  readonly nameFlight: string;

  @MinLength(2, {message: 'Поле вылета должно содержать более 2х символов!'})
  readonly fromCity: string;


  @MinLength(2, {message: 'Поле прилёта должно содержать более 2х символов!'})
  readonly intoCity: string;

  @IsNotEmpty({message: 'Поле дата вылета не должно быть пустым!'})
  readonly flightDate: string;

  @IsNotEmpty({message: 'Поле время вылета не должно быть пустым!'})
  readonly flightTime: string;

  @Min(1,{message: 'Поле примерное время полёта должно содержать более одного символа!'})
  readonly arrivalTime: number;

  @Min(1000, {message: 'Цена эконом-класса не может быть менее 1000р!'})
  readonly priceEconomy: number;

  @Min(1000, {message: 'Цена бизнесс-класса не может быть менее 1000р!'})
  readonly priceBusiness: number;

  @Min(1000, {message: 'Цена первого-класса не может быть менее 1000р!'})
  readonly pricePremium: number;

  @IsNotEmpty({message: 'Поле всего мест в самолёте не должно быть пустым!'})
  readonly seatsAvailable: number;

  @IsNotEmpty({message: 'Поле места в эконом-классе не должно быть пустым!'})
  readonly seatsEconomy: number;

  @IsNotEmpty({message: 'Поле места в бизнесс-классе не должно быть пустым!'})
  readonly seatsBusiness: number;

  @IsNotEmpty({message: 'Поле места в первом-классе не должно быть пустым!'})
  readonly seatsPremium: number;
}