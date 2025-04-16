import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Column,
  DataSource,
  Entity,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';
import { NotificationsEntity, UserEntity } from 'src/entities';
import { resourceUsage } from 'process';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationsEntity)
    private readonly i_repository: Repository<NotificationsEntity>,
    private dataSource: DataSource,
  ) {}

  async getAll() {
    return await this.i_repository
      .createQueryBuilder('notifications')
      .leftJoinAndMapOne(
        'notifications.user_id',
        UserEntity,
        'users',
        'notifications.user_id = users.id',
      )
      .leftJoinAndMapOne(
        'notifications.sender_id',
        UserEntity,
        'sender',
        'notifications.sender_id = sender.id',
      )
      .orderBy('notifications.datetime_added', 'DESC')
      .getMany();
  }

  async findItem(id: number) {
    return await this.i_repository
      .createQueryBuilder('notifications')
      .leftJoinAndMapOne(
        'notifications.user_id',
        UserEntity,
        'users',
        'notifications.user_id = users.id',
      )
      .leftJoinAndMapOne(
        'notifications.sender_id',
        UserEntity,
        'sender',
        'notifications.sender_id = sender.id',
      )
      .where('notifications.id = :id', { id: id })
      .getOne();
  }

  async findItemByUser(id: number) {
    return await this.i_repository
      .createQueryBuilder('notifications')
      .leftJoinAndMapOne(
        'notifications.user_id',
        UserEntity,
        'users',
        'notifications.user_id = users.id',
      )
      .leftJoinAndMapOne(
        'notifications.sender_id',
        UserEntity,
        'sender',
        'notifications.sender_id = sender.id',
      )
      .where('notifications.user_id = :id', { id: id })
      .orderBy('notifications.datetime_added', 'DESC')
      .getMany();
  }

  async addItem(user: NotificationsEntity): Promise<NotificationsEntity> {
    return await this.i_repository.save(user);
  }

  async read(id: number) {
    try {
      await this.dataSource.manager.update(NotificationsEntity, id, {
        hasRead: 1,
      });
      return {
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.error(error);
      return {
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
