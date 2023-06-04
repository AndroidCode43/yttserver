import { forwardRef, Module } from "@nestjs/common";
import { InfoService } from './info.service';
import { InfoController } from './info.controller';
import { AuthModule } from "../auth/auth.module";
import { TicketsModule } from "../tikets/tickets.module";
import { UsersModule } from "../users/users.module";
import { FlightsModule } from "../flights/flights.module";
import { PlanesModule } from "../planes/planes.module";

@Module({
  controllers: [InfoController],
  providers: [InfoService],
  imports: [
    forwardRef(() => AuthModule),
    TicketsModule,
    UsersModule,
    FlightsModule,
    PlanesModule
  ]
})

export class InfoModule {}
