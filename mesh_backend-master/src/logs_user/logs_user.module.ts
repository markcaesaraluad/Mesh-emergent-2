import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LogsUserEntity } from "./logs_user.entity";
import { LogsUserController } from "./logs_user.controller";
import { LogsUserService } from "./logs_user.service";


@Module({
  imports: [TypeOrmModule.forFeature([LogsUserEntity])],
  controllers: [LogsUserController],
  providers: [LogsUserService],
})
export class LogsUserModule {}
