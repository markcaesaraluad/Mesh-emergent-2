import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from 'src/notifications/notifications.service';
import { DataSource } from 'typeorm';
import { NotifsService } from './notifs.service';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotifGateway {
  constructor(
    private dataSource: DataSource,
    private notifService: NotifsService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('loadMyNotifs')
  loadMyNotifs(@MessageBody('userID') userID: string) {
    // console.log('LOADED FROM RT', userID);
    // setInterval(() => {
    // this.server.emit(`myNotifs_${userID}`, { data: 'dasss' });
    // }, 1000);

    return this.notifService.getMyNotifs(+userID);
  }

  @OnEvent('on_create_notif')
  async handleNotify(payload: any) {
    let data = await this.notifService.getNotifByID(payload.notif.id);
    this.server.emit(`myNotifs_${payload.userID}`, { data: data });
  }

  // @SubscribeMessage('saveSocketConnection')
  // async saveSocketConnection(@MessageBody() saveSocket: SaveConnectionDTO) {
  //   let user = decodeCurrentUser(saveSocket.token);

  //   await this.chatService.saveSocketConnection(user, saveSocket);
  // }
}
