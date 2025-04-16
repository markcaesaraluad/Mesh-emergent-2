import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { encodePassword } from "src/utils/bcrypt";
import { AreaRoomsReservationEntity } from "./area_rooms_reservation.entity";
import { AreaRoomsEntity, AreasEntity, RatesEntity, UserEntity } from "src/entities";

@Injectable()
export class AreaRoomsReservationService {

    constructor(
        @InjectRepository(AreaRoomsReservationEntity)
        private i_repository: Repository<AreaRoomsReservationEntity>,
        private dataSource: DataSource


    ) { }

    async getAll(page: number, limit: number){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('area_rooms_reservation');

      // query.leftJoinAndMapOne('area_rooms_reservation.ut_id',area_rooms_reservationTypesEntity,'area_rooms_reservation_type','area_rooms_reservation.ut_id = area_rooms_reservation_type.id')

      const results = await query
      .orderBy('area_rooms_reservation.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

  async getCount(){

    const total_cnt = await this.i_repository.createQueryBuilder("area_rooms_reservation")
    .select("COUNT(area_rooms_reservation.id)", "cnt")
    .getRawOne();

    return {
      total_cnt : total_cnt.cnt,
    };
}

  async findItem(id : number){

      return await this.i_repository.createQueryBuilder("area_rooms_reservation")
      .leftJoinAndMapOne('area_rooms_reservation.user_id',UserEntity,'user','area_rooms_reservation.user_id = user.id')
      .leftJoinAndMapOne('area_rooms_reservation.area_id',AreasEntity,'area','area_rooms_reservation.area_id = area.id')
      .leftJoinAndMapOne('area_rooms_reservation.rate_id',RatesEntity,'rate','area_rooms_reservation.rate_id = rate.id')
      .leftJoinAndMapOne('area_rooms_reservation.area_room_id',AreaRoomsEntity,'area_room','area_rooms_reservation.area_room_id = area_room.id')
      .where("area_rooms_reservation.id = :id", {id : id})
      .getOne();
  }

  async findItemByUser(id : number, input_date : string){

    return await this.i_repository.createQueryBuilder("area_rooms_reservation")
    .leftJoinAndMapOne('area_rooms_reservation.user_id',UserEntity,'user','area_rooms_reservation.user_id = user.id')
    .leftJoinAndMapOne('area_rooms_reservation.area_id',AreasEntity,'area','area_rooms_reservation.area_id = area.id')
    .leftJoinAndMapOne('area_rooms_reservation.rate_id',RatesEntity,'rate','area_rooms_reservation.rate_id = rate.id')
    .where("area_rooms_reservation.user_id = :id AND MONTH(area_rooms_reservation.datetime_reserved) = MONTH(:input_date)", {id : id, input_date : input_date})
    .getMany();
}

  async searchName(name : string){

    return await this.i_repository.createQueryBuilder("area_rooms_reservation")
    .where("area_rooms_reservation.lname LIKE :name OR area_rooms_reservation.fname LIKE :name", {name : `%${name}%`})
    .getMany();
}

  async addItem(data: AreaRoomsReservationEntity): Promise<AreaRoomsReservationEntity>{
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try{

      const res = this.i_repository.save(data);
      await queryRunner.commitTransaction();
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

          const total_cnt = await this.i_repository.createQueryBuilder("area_rooms_reservation")
          .select("COUNT(area_rooms_reservation.id)", "cnt")
          .where("area_rooms_reservation.user_id = :id AND (DATE(area_rooms_reservation.datetime_reserved) >= CURDATE() AND area_rooms_reservation.status = :status) ", {id : id, status : status})
          .getRawOne();
      
          return {
            total_cnt : total_cnt.cnt,
          };
      }

      async getAppointments(input_date : string){

        return await this.i_repository.createQueryBuilder("area_rooms_reservation")
        .leftJoinAndMapOne('area_rooms_reservation.user_id',UserEntity,'user','area_rooms_reservation.user_id = user.id')
        .leftJoinAndMapOne('area_rooms_reservation.area_id',AreasEntity,'area','area_rooms_reservation.area_id = area.id')
        .leftJoinAndMapOne('area_rooms_reservation.rate_id',RatesEntity,'rate','area_rooms_reservation.rate_id = rate.id')
        .where("MONTH(area_rooms_reservation.datetime_reserved) = MONTH(:input_date)", {input_date : input_date})
        .getMany();
    }

    async updateAppointment(data:any){

      return await this.i_repository.update(data.id, { 
        status : data.status
      //   profile_pic: data.profile_pic,
      });
  
    }

}
