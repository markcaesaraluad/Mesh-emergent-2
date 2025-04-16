import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AreaRoomsReservationEntity } from "./area_rooms_reservation.entity";
import { AreaRoomsReservationController } from "./area_rooms_reservation.controller";
import { AreaRoomsReservationService } from "./area_rooms_reservation.service";

@Module({
  imports: [TypeOrmModule.forFeature([AreaRoomsReservationEntity])],
  controllers: [AreaRoomsReservationController],
  providers: [AreaRoomsReservationService],
})
export class AreaRoomsReservationModule {}
