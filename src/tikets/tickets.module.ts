import { forwardRef, Module } from "@nestjs/common";
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketEntity } from "./entitiy/ticket.entity";
import { FlightsModule } from "../flights/flights.module";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [TypeOrmModule.forFeature([TicketEntity]),
    FlightsModule,
    UsersModule,
    forwardRef(() => AuthModule)
  ],
  exports: [TicketsService]
})
export class TicketsModule {}
