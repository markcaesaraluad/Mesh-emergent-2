import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserLogsEntity } from "./user_logs.entity";
import { UserLogsController } from "./user_logs.controller";
import { UserLogsService } from "./user_logs.service";
@Module({
  imports: [TypeOrmModule.forFeature([UserLogsEntity])],
  controllers: [UserLogsController],
  providers: [UserLogsService],
})
export class UserLogsModule {}
