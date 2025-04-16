import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { encodePassword } from "src/utils/bcrypt";
import { AreaRoomsEntity, AreasEntity, RatesEntity, UserEntity,NotificationsEntity, UserWalletTransactionEntity } from "src/entities";
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserWalletTransactionService {

    constructor(
        @InjectRepository(UserWalletTransactionEntity)
        private i_repository: Repository<UserWalletTransactionEntity>,
        private dataSource: DataSource,
        private eventEmitter: EventEmitter2,

    ) { }

    async getAll(page: number, limit: number){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('user_wallet_transaction');

      query.leftJoinAndMapOne('user_wallet_transaction.user_id',UserEntity,'user','user_wallet_transaction.user_id = user.id')

      const results = await query
      .orderBy('user_wallet_transaction.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

  async getCount(){

    const total_cnt = await this.i_repository.createQueryBuilder("user_wallet_transaction")
    .select("COUNT(user_wallet_transaction.id)", "cnt")
    .getRawOne();

    return {
      total_cnt : total_cnt.cnt,
    };
}

  async findItem(id : number){

      return await this.i_repository.createQueryBuilder("user_wallet_transaction")
      .leftJoinAndMapOne('user_wallet_transaction.user_id',UserEntity,'user','user_wallet_transaction.user_id = user.id')
      .where("user_wallet_transaction.id = :id", {id : id})
      .getOne();
  }

  async findItemByUser(id : number, input_date : string){

    return await this.i_repository.createQueryBuilder("user_wallet_transaction")
    .leftJoinAndMapOne('user_wallet_transaction.user_id',UserEntity,'user','user_wallet_transaction.user_id = user.id')
    .where("user_wallet_transaction.user_id = :id AND MONTH(user_wallet_transaction.datetime_reserved) = MONTH(:input_date)", {id : id, input_date : input_date})
    .getMany();
}

  async searchName(name : string){

    return await this.i_repository.createQueryBuilder("user_wallet_transaction")
    .where("user_wallet_transaction.lname LIKE :name OR user_wallet_transaction.fname LIKE :name", {name : `%${name}%`})
    .getMany();
}

  async addItem(data: UserWalletTransactionEntity): Promise<UserWalletTransactionEntity>{
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try{

      const res = this.i_repository.save(data);
      await queryRunner.commitTransaction();

      const user = await this.dataSource.manager.findOne(UserEntity, {
        where: { id: data.user_id }
      });
      
      let notification = this.dataSource.manager.create(NotificationsEntity, {
        sender_id: data.user_id,
        user_id: 1,
        hasRead: 0,
        description: `${user.fname} ${user.lname} has added new wallet amount.`,
        datetime_added: new Date()
      });
      
      let savedNotif = await this.dataSource.manager.save(notification);
      this.eventEmitter.emit('on_create_notif', { userID: 1, notif: savedNotif });
      return res;
      
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    
  }

      async updateProfilePic(data:any){

        return await this.i_repository.update(data.id, { 
        //   profile_pic: data.profile_pic,
        });
    
      }

      async cancelAppointment(data:any){

        return await this.i_repository.delete(data.id);
  
        }

        async getIncomingAppointmentsCnt(id : number, status : number){

          const total_cnt = await this.i_repository.createQueryBuilder("user_wallet_transaction")
          .select("COUNT(user_wallet_transaction.id)", "cnt")
          .where("user_wallet_transaction.user_id = :id AND (DATE(user_wallet_transaction.datetime_reserved) >= CURDATE() AND user_wallet_transaction.status = :status) ", {id : id, status : status})
          .getRawOne();
      
          return {
            total_cnt : total_cnt.cnt,
          };
      }

      async getAppointments(input_date : string){

        return await this.i_repository.createQueryBuilder("user_wallet_transaction")
        .leftJoinAndMapOne('user_wallet_transaction.user_id',UserEntity,'user','user_wallet_transaction.user_id = user.id')
        .leftJoinAndMapOne('user_wallet_transaction.area_id',AreasEntity,'area','user_wallet_transaction.area_id = area.id')
        .leftJoinAndMapOne('user_wallet_transaction.rate_id',RatesEntity,'rate','user_wallet_transaction.rate_id = rate.id')
        .where("MONTH(user_wallet_transaction.datetime_reserved) = MONTH(:input_date)", {input_date : input_date})
        .getMany();
    }

    async updateWallet(data: any) {
      const approved = await this.i_repository.update(data.id, { 
        isApproved: data.isApproved
      });
    
      if (approved.affected === 1) {
        const transaction = await this.i_repository.findOne({
          where: { id: data.id }
        });
        
        if (transaction) {
          let notification = this.dataSource.manager.create(NotificationsEntity, {
            sender_id: 1,
            user_id: transaction.user_id,
            hasRead: 0,
            description: data.isApproved == 1 
              ? 'Your wallet/credit request has been approved and updated.' 
              : 'Your wallet/credit request has been denied.',
            datetime_added: new Date()
          });
    
          const savedNotif = await this.dataSource.manager.save(notification);
          
          this.eventEmitter.emit('on_create_notif', { 
            userID: transaction.user_id, 
            notif: savedNotif 
          });
    
          return approved;
        }
      }
      
      return approved;
    }

    async findByUser(id : number){

      return await this.i_repository.createQueryBuilder("user_wallet_transaction")
      .leftJoinAndMapOne('user_wallet_transaction.user_id',UserEntity,'user','user_wallet_transaction.user_id = user.id')
      .where("user_wallet_transaction.user_id = :id", {id : id})
      .orderBy('user_wallet_transaction.datetime_added', 'DESC')
      .getMany();
  }

}
