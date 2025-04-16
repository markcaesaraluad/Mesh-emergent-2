import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationsEntity } from "./notifications.entity";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";


@Module({
  imports: [TypeOrmModule.forFeature([NotificationsEntity])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
