import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TimeShiftsEntity } from "./time_shifts.entity";
import { TimeShiftsController } from "./time_shifts.controller";
import { TimeShiftsService } from "./time_shifts.service";
@Module({
  imports: [TypeOrmModule.forFeature([TimeShiftsEntity])],
  controllers: [TimeShiftsController],
  providers: [TimeShiftsService],
})
export class TimeShiftsModule {}
