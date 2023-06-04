import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { PlanesService } from './planes.service';
import { CreatePlaneDto } from "./dto/CreatePlane.dto";
import { TypeGuard } from "../guards/type.guard";
import { Types } from "../decorators/type.decorator";

@Controller('planes')
export class PlanesController {
  constructor(private readonly planesService: PlanesService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  createPlane(@Body() dto: CreatePlaneDto){
    return this.planesService.createPlane(dto);
  }

  @Delete('/delete/:id')
  deletePlane(@Param('id') id: number){
    return this.planesService.delPlane(id);
  }

  @Types('ADMIN')
  @UseGuards(TypeGuard)
  @Get('/all')
  getAllPlanes(){
    return this.planesService.getAllPlanes();
  }
}