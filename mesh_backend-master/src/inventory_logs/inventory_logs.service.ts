import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryLogsEntity } from "./inventory_logs.entity";
@Injectable()
export class InventoryLogsService {

    constructor(
        @InjectRepository(InventoryLogsEntity)
        private i_repository: Repository<InventoryLogsEntity>,
        private dataSource: DataSource


    ) { }

    async getAll(page: number, limit: number){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('inventory_logs');

      // query.leftJoinAndMapOne('inventory_logs.ut_id',inventory_logsTypesEntity,'inventory_logs_type','inventory_logs.ut_id = inventory_logs_type.id')

      const results = await query
      .orderBy('inventory_logs.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

  async getCount(){

    const total_cnt = await this.i_repository.createQueryBuilder("inventory_logs")
    .select("COUNT(inventory_logs.id)", "cnt")
    .getRawOne();

    return {
      total_cnt : total_cnt.cnt,
    };
}

  async findItem(id : number){

      return await this.i_repository.createQueryBuilder("inventory_logs")
      .where("inventory_logs.id = :id", {id : id})
      .getOne();
  }

  async addItem(data: InventoryLogsEntity): Promise<InventoryLogsEntity>{
    
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
