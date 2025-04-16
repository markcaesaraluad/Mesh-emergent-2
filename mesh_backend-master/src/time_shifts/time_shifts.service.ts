import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AreasEntity } from "src/entities";
import { TimeShiftsEntity } from "./time_shifts.entity";
@Injectable()
export class TimeShiftsService {

    constructor(
        @InjectRepository(TimeShiftsEntity)
        private i_repository: Repository<TimeShiftsEntity>,
        private dataSource: DataSource


    ) { }

    async getAll(page: number, limit: number){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('time_shifts');

      // query.leftJoinAndMapOne('time_shifts.ut_id',time_shiftsTypesEntity,'time_shifts_type','time_shifts.ut_id = time_shifts_type.id')

      const results = await query
      .orderBy('time_shifts.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

  async getCount(){

    const total_cnt = await this.i_repository.createQueryBuilder("time_shifts")
    .select("COUNT(time_shifts.id)", "cnt")
    .getRawOne();

    return {
      total_cnt : total_cnt.cnt,
    };
}

  async findItem(id : number){

      return await this.i_repository.createQueryBuilder("time_shifts")
      .where("time_shifts.id = :id", {id : id})
      .getOne();
  }

  async findItemByName(name : string){

    return await this.i_repository.createQueryBuilder("time_shifts")
    .leftJoinAndMapOne('time_shifts.area_id',AreasEntity,'area','time_shifts.area_id = area.id')
    .where("area.description LIKE :name", {name : `%${name}%`})
    .getMany();
}

async findItemByType(type : number){

  return await this.i_repository.createQueryBuilder("time_shifts")
  .leftJoinAndMapOne('time_shifts.area_id',AreasEntity,'area','time_shifts.area_id = area.id')
  .where("time_shifts.type = :type", {type : type})
  .getOne();
}

async findItemByPackage(type : number, area_id : number){

  return await this.i_repository.createQueryBuilder("time_shifts")
  .leftJoinAndMapOne('time_shifts.area_id',AreasEntity,'area','time_shifts.area_id = area.id')
  .where("time_shifts.type = :type AND time_shifts.area_id = :area_id", {type : type, area_id: area_id})
  .getMany();
}

  async findItemByArea(id : number){

    return await this.i_repository.createQueryBuilder("time_shifts")
    .where("time_shifts.area_id = :id", {id : id})
    .getMany();
}

  async addItem(data: TimeShiftsEntity): Promise<TimeShiftsEntity>{
    
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

  async editItem(data:any){

    return await this.i_repository.update(data.id, { 

      time_start: data.time_start,
      time_end : data.time_end,
      description : data.description,
      
    });

    }

}
