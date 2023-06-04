import { forwardRef, Module } from "@nestjs/common";
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import { FlightsEntity } from "./entity/flights.entity";
import { PlanesModule } from "../planes/planes.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [FlightsController],
  providers: [FlightsService],
  imports: [
    TypeOrmModule.forFeature([FlightsEntity]),
    PlanesModule,
    forwardRef(() => AuthModule)
  ],
  exports: [FlightsService]
})
export class FlightsModule {}