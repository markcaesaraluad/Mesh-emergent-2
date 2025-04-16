import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProductEntity } from "./user_product.entity";
@Injectable()
export class UserProductService {

    constructor(
        @InjectRepository(UserProductEntity)
        private i_repository: Repository<UserProductEntity>,
        private dataSource: DataSource


    ) { }

    async getAll(page: number, limit: number){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('user_product');

      // query.leftJoinAndMapOne('user_product.ut_id',user_productTypesEntity,'user_product_type','user_product.ut_id = user_product_type.id')

      const results = await query
      .orderBy('user_product.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

  async getCount(){

    const total_cnt = await this.i_repository.createQueryBuilder("user_product")
    .select("COUNT(user_product.id)", "cnt")
    .getRawOne();

    return {
      total_cnt : total_cnt.cnt,
    };
}

  async findItem(id : number){

      return await this.i_repository.createQueryBuilder("user_product")
      .where("user_product.id = :id", {id : id})
      .getOne();
  }

  async addItem(data: UserProductEntity): Promise<UserProductEntity>{
    
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
