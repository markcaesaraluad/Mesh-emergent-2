import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeSessionsController } from "./employee_sessions.controller";
import { EmployeeSessionsService } from "./employee_sessions.service";
import { EmployeeSessionsEntity } from "./employee_sessions.entity";

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeSessionsEntity])],
  controllers: [EmployeeSessionsController],
  providers: [EmployeeSessionsService],
})
export class EmployeeSessionsModule {}
