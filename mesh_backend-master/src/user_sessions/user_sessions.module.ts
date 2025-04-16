import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserSessionsEntity } from "./user_sessions.entity";
import { UserSessionsController } from "./user_sessions.controller";
import { UserSessionsService } from "./user_sessions.service";
@Module({
  imports: [TypeOrmModule.forFeature([UserSessionsEntity])],
  controllers: [UserSessionsController],
  providers: [UserSessionsService],
})
export class UserSessionsModule {}
