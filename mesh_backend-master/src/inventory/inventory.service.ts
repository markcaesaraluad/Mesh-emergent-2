import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryEntity } from "./inventory.entity";

@Injectable()
export class InventoryService {

    constructor(
        @InjectRepository(InventoryEntity)
        private i_repository: Repository<InventoryEntity>,
        private dataSource: DataSource


    ) { }

    async getAll(page: number, limit: number){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('inventory');

      // query.leftJoinAndMapOne('inventory.ut_id',inventoryTypesEntity,'inventory_type','inventory.ut_id = inventory_type.id')

      const results = await query
      .orderBy('inventory.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

  async getCount(){

    const total_cnt = await this.i_repository.createQueryBuilder("inventory")
    .select("COUNT(inventory.id)", "cnt")
    .getRawOne();

    return {
      total_cnt : total_cnt.cnt,
    };
}

  async findItem(id : number){

      return await this.i_repository.createQueryBuilder("inventory")
      .where("inventory.id = :id", {id : id})
      .getOne();
  }

  async addItem(data: InventoryEntity): Promise<InventoryEntity>{
    
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
