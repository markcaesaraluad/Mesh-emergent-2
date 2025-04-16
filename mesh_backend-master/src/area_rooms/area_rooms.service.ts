import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { encodePassword } from "src/utils/bcrypt";
import { AreaRoomsEntity } from "./area_rooms.entity";
import { AreaRoomsReservationEntity } from "src/entities";

@Injectable()
export class AreaRoomsService {

    constructor(
        @InjectRepository(AreaRoomsEntity)
        private i_repository: Repository<AreaRoomsEntity>,
        private dataSource: DataSource


    ) { }

    async getAll(page: number, limit: number){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('area_rooms');

      // query.leftJoinAndMapOne('area_rooms.ut_id',area_roomsTypesEntity,'area_rooms_type','area_rooms.ut_id = area_rooms_type.id')

      const results = await query
      .orderBy('area_rooms.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

  async getCount(){

    const total_cnt = await this.i_repository.createQueryBuilder("area_rooms")
    .select("COUNT(area_rooms.id)", "cnt")
    .getRawOne();

    return {
      total_cnt : total_cnt.cnt,
    };
}

  async findItem(id : number){

      return await this.i_repository.createQueryBuilder("area_rooms")
      .where("area_rooms.id = :id", {id : id})
      .getOne();
  }

  async findItemArea(id : number){

    return await this.i_repository.createQueryBuilder("area_rooms")
    .where("area_rooms.area_id = :id", {id : id})
    .getMany();
}

async findSeats(id : number, input_date : string){

    return await this.i_repository.createQueryBuilder("area_rooms")
    .leftJoinAndMapOne('area_rooms.is_reserved',AreaRoomsReservationEntity,'arr','area_rooms.area_id = arr.area_id AND DATE(arr.datetime_reserved) = DATE(:input_date) AND area_rooms.id = arr.area_room_id', {input_date : input_date})
    .where("area_rooms.area_id = :id", {id : id})
    .orderBy("area_rooms.num", "ASC")
    .getMany();
}

  async searchName(name : string){

    return await this.i_repository.createQueryBuilder("area_rooms")
    .where("area_rooms.lname LIKE :name OR area_rooms.fname LIKE :name", {name : `%${name}%`})
    .getMany();
}

  async addItem(data: AreaRoomsEntity): Promise<AreaRoomsEntity>{
    
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

}
