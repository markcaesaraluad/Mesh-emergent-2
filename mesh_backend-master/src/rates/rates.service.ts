import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RatesEntity } from "./rates.entity";
import { AreasEntity } from "src/entities";
@Injectable()
export class RatesService {

    constructor(
        @InjectRepository(RatesEntity)
        private i_repository: Repository<RatesEntity>,
        private dataSource: DataSource


    ) { }

    async getAll(page: number, limit: number){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('rates');

      // query.leftJoinAndMapOne('rates.ut_id',ratesTypesEntity,'rates_type','rates.ut_id = rates_type.id')

      const results = await query
      .orderBy('rates.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

  async getCount(){

    const total_cnt = await this.i_repository.createQueryBuilder("rates")
    .select("COUNT(rates.id)", "cnt")
    .getRawOne();

    return {
      total_cnt : total_cnt.cnt,
    };
}

  async findItem(id : number){

      return await this.i_repository.createQueryBuilder("rates")
      .where("rates.id = :id", {id : id})
      .getOne();
  }

  async findItemByName(name : string){

    return await this.i_repository.createQueryBuilder("rates")
    .leftJoinAndMapOne('rates.area_id',AreasEntity,'area','rates.area_id = area.id')
    .where("area.description LIKE :name", {name : `%${name}%`})
    .getMany();
}

async findItemByType(type : number){

  return await this.i_repository.createQueryBuilder("rates")
  .leftJoinAndMapOne('rates.area_id',AreasEntity,'area','rates.area_id = area.id')
  .where("rates.type = :type", {type : type})
  .getOne();
}

async findItemByPackage(type : number, area_id : number){

  return await this.i_repository.createQueryBuilder("rates")
  .leftJoinAndMapOne('rates.area_id',AreasEntity,'area','rates.area_id = area.id')
  .where("rates.type = :type AND rates.area_id = :area_id", {type : type, area_id: area_id})
  .getMany();
}

  async findItemByArea(id : number){

    return await this.i_repository.createQueryBuilder("rates")
    .where("rates.area_id = :id", {id : id})
    .getMany();
}

  async addItem(data: RatesEntity): Promise<RatesEntity>{
    
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

      description: data.description,
      duration : data.duration,
      area_id : data.area_id,
      rate : data.rate,
      exceed : data.exceed,
      rate_type: data.rate_type,
      
    });

    }

}
