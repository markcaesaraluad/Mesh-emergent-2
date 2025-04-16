import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTypesEntity } from "./user_types.entity";
@Injectable()
export class UserTypesService {

    constructor(
        @InjectRepository(UserTypesEntity)
        private i_repository: Repository<UserTypesEntity>,
        private dataSource: DataSource


    ) { }

    async allItems(){

      const query = this.i_repository.createQueryBuilder('user_types');

      const results = await query
      .orderBy('user_types.description', 'ASC')
      .getManyAndCount();

      return results;
  }

    async getAll(page: number, limit: number){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('user_types');

      // query.leftJoinAndMapOne('user_types.ut_id',user_typesTypesEntity,'user_types_type','user_types.ut_id = user_types_type.id')

      const results = await query
      .orderBy('user_types.description', 'ASC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

  async getCount(){

    const total_cnt = await this.i_repository.createQueryBuilder("user_types")
    .select("COUNT(user_types.id)", "cnt")
    .getRawOne();

    return {
      total_cnt : total_cnt.cnt,
    };
}

  async findItem(id : number){

      return await this.i_repository.createQueryBuilder("user_types")
      .where("user_types.id = :id", {id : id})
      .getOne();
  }

  async addItem(data: UserTypesEntity): Promise<UserTypesEntity>{
    
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

  async findItemByName(name : string){

    return await this.i_repository.createQueryBuilder("user_types")
    .where("user_types.description LIKE :name", {name : `%${name}%`})
    .getOne();
}

}
