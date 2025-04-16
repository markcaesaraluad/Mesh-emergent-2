import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AreaRoomsEntity } from "./area_rooms.entity";
import { AreaRoomsService } from "./area_rooms.service";
import { AreaRoomsController } from "./area_rooms.controller";
@Module({
  imports: [TypeOrmModule.forFeature([AreaRoomsEntity])],
  controllers: [AreaRoomsController],
  providers: [AreaRoomsService],
})
export class AreaRoomsModule {}
