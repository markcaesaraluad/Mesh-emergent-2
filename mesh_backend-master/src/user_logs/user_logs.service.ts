import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLogsEntity } from "./user_logs.entity";
@Injectable()
export class UserLogsService {

    constructor(
        @InjectRepository(UserLogsEntity)
        private i_repository: Repository<UserLogsEntity>,
        private dataSource: DataSource


    ) { }

    async getAll(page: number, limit: number){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('user_logs');

      // query.leftJoinAndMapOne('user_logs.ut_id',user_logsTypesEntity,'user_logs_type','user_logs.ut_id = user_logs_type.id')

      const results = await query
      .orderBy('user_logs.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

  async getCount(){

    const total_cnt = await this.i_repository.createQueryBuilder("user_logs")
    .select("COUNT(user_logs.id)", "cnt")
    .getRawOne();

    return {
      total_cnt : total_cnt.cnt,
    };
}

  async findItem(id : number){

      return await this.i_repository.createQueryBuilder("user_logs")
      .where("user_logs.id = :id", {id : id})
      .getOne();
  }

  async addItem(data: UserLogsEntity): Promise<UserLogsEntity>{
    
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

}
