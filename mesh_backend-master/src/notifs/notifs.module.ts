import { Module } from '@nestjs/common';
import { NotifsService } from './notifs.service';
import { NotifsController } from './notifs.controller';
import { NotifGateway } from './notifs.gateway';

@Module({
  controllers: [NotifsController],
  providers: [NotifsService, NotifGateway],
})
export class NotifsModule {}
