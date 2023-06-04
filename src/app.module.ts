import { Module } from '@nestjs/common';
import { PlanesModule } from './planes/planes.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import { PlaneEntity } from "./planes/entities/plane.entity";
import { FlightsModule } from './flights/flights.module';
import { TicketsModule } from './tikets/tickets.module';
import { UsersModule } from './users/users.module';
import { FlightsEntity } from "./flights/entity/flights.entity";
import { UserEntity } from "./users/entities/user.entity";
import { TicketEntity } from "./tikets/entitiy/ticket.entity";
import { AuthModule } from './auth/auth.module';
import { InfoModule } from './info/info.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        PlaneEntity,
        FlightsEntity,
        UserEntity,
        TicketEntity
      ],
      synchronize: true
    }),
    PlanesModule,
    FlightsModule,
    TicketsModule,
    UsersModule,
    AuthModule,
    InfoModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
