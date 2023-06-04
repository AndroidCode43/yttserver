import { forwardRef, Module } from "@nestjs/common";
import { PlanesService } from './planes.service';
import { PlanesController } from './planes.controller';
import { PlaneEntity } from "./entities/plane.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [PlanesController],
  providers: [PlanesService],
  imports: [
    TypeOrmModule.forFeature([PlaneEntity]),
    forwardRef(() => AuthModule)
  ],
  exports: [PlanesService]
})
export class PlanesModule {}
