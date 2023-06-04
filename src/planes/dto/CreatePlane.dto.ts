import {MinLength, IsNotEmpty} from "class-validator";

export class CreatePlaneDto{

  @MinLength(2, {message: 'Название должно быть более 2х символов!'})
  readonly name: string;

  @MinLength(1, {message: 'Описание должно быть больше одного символа!'})
  readonly description: string;

  @IsNotEmpty()
  readonly numbOfSeats: number;
}