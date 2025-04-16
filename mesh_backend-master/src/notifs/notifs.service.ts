import { Injectable } from '@nestjs/common';
import { CreateNotifDto } from './dto/create-notif.dto';
import { UpdateNotifDto } from './dto/update-notif.dto';
import { DataSource } from 'typeorm';
import { NotificationsEntity, UserEntity } from 'src/entities';

@Injectable()
export class NotifsService {
  constructor(private dataSource: DataSource) {}
  create(createNotifDto: CreateNotifDto) {
    return 'This action adds a new notif';
  }

  findAll() {
    return `This action returns all notifs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notif`;
  }

  async getMyNotifs(id: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(NotificationsEntity, 'notif')
      .select([
        'notif.*',
        'CONCAT(u.fname, " ", u.lname) as user_Name',
        'CONCAT(u1.fname, " ", u1.lname) as sender_Name',
      ])
      .leftJoin(UserEntity, 'u', 'u.id = notif.user_id')
      .leftJoin(UserEntity, 'u1', 'u1.id = notif.sender_id')
      .where('notif.user_id = :userID', { userID: id })
      .orderBy('notif.hasRead', 'ASC')
      .addOrderBy('DATE(notif.datetime_added)', 'DESC')
      .execute();
    return data;
  }

  async getNotifByID(id: number) {
    let data = await this.dataSource.manager
      .createQueryBuilder(NotificationsEntity, 'notif')
      .select([
        'notif.*',
        'CONCAT(u.fname, " ", u.lname) as user_Name',
        'CONCAT(u1.fname, " ", u1.lname) as sender_Name',
      ])
      .leftJoin(UserEntity, 'u', 'u.id = notif.user_id')
      .leftJoin(UserEntity, 'u1', 'u1.id = notif.sender_id')
      .where('notif.id = :id', { id })
      .getRawOne();
    return data;
  }

  update(id: number, updateNotifDto: UpdateNotifDto) {
    return `This action updates a #${id} notif`;
  }

  remove(id: number) {
    return `This action removes a #${id} notif`;
  }
}
