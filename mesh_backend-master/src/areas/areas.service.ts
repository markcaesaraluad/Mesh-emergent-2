import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { encodePassword } from "src/utils/bcrypt";
import { AreasEntity } from "./areas.entity";

@Injectable()
export class AreasService {

    constructor(
        @InjectRepository(AreasEntity)
        private i_repository: Repository<AreasEntity>,
        private dataSource: DataSource


    ) { }

    async getAllItem(){


      return await this.i_repository.createQueryBuilder("areas")
      .getMany();
  }

    async getAll(page: number, limit: number){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('areas');

      // query.leftJoinAndMapOne('areas.ut_id',areasTypesEntity,'areas_type','areas.ut_id = areas_type.id')

      const results = await query
      .orderBy('areas.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

  async getCount(){

    const total_cnt = await this.i_repository.createQueryBuilder("areas")
    .select("COUNT(areas.id)", "cnt")
    .getRawOne();

    return {
      total_cnt : total_cnt.cnt,
    };
}

  async findItem(id : number){

      return await this.i_repository.createQueryBuilder("areas")
      .where("areas.id = :id", {id : id})
      .getOne();
  }

  async searchName(name : string){

    return await this.i_repository.createQueryBuilder("areas")
    .where("areas.lname LIKE :name OR areas.fname LIKE :name", {name : `%${name}%`})
    .getMany();
}

  async addItem(data: AreasEntity): Promise<AreasEntity>{
    
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
          profile_pic: data.profile_pic,
        });
    
      }

}
