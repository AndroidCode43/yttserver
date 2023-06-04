import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { PlaneEntity } from "./entities/plane.entity";
import { CreatePlaneDto } from "./dto/CreatePlane.dto";

@Injectable()
export class PlanesService {

  constructor(@InjectRepository(PlaneEntity)
              private repository: Repository<PlaneEntity>) {}

  async createPlane(dto: CreatePlaneDto){
    const findPlane = await this.repository.findOne({
      where: {name: dto.name}
    });

    if(findPlane){
     throw new HttpException('Самолёт с таким названием уже существует!', HttpStatus.BAD_REQUEST);
    }

    const findDesc = await this.repository.findOne({
      where: {description: dto.description}
    });

    if(findDesc){
      throw new HttpException('Самолёт с таким описанием уже существует!', HttpStatus.BAD_REQUEST);
    }

    return this.repository.save(dto);
  }

  async getAllPlanes(){
    return this.repository.find();
  }

  async delPlane(id: number){
    const findPlane = await this.findPlaneById(id);

    if(!findPlane){
      throw new HttpException('Самолёт с таким id не найден!', HttpStatus.NOT_FOUND);
    }

    return this.repository.delete(id);
  }

  async findPlaneById(id: number){
    const plane = await this.repository.findOne({
      where: {id: id}
    });

    if(!plane){
      throw new HttpException('Самолёт с таким id не найден!', HttpStatus.NOT_FOUND);
    }

    return plane;
  }
}