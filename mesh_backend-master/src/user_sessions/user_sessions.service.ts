import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSessionsEntity } from "./user_sessions.entity";
import { RatesEntity, UserEntity, UserPackagesEntity } from "src/entities";
@Injectable()
export class UserSessionsService {

    constructor(
        @InjectRepository(UserSessionsEntity)
        private i_repository: Repository<UserSessionsEntity>,
        private dataSource: DataSource


    ) { }

    async getAll(page: number, limit: number){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('user_sessions');
      query.leftJoinAndMapOne('user_sessions.user_id',UserEntity,'user','user_sessions.user_id = user.id');
      query.leftJoinAndMapOne('user_sessions.package_id',UserPackagesEntity,'user_package','user_sessions.package_id = user_package.id');
      query.leftJoinAndMapOne('user_package.rate_id',RatesEntity,'rate','user_package.rate_id = rate.id');
      query.where('(user_sessions.datetime_added >= CURDATE() - INTERVAL 1 DAY AND user_sessions.datetime_added < CURDATE() + INTERVAL 1 DAY)');
      query.andWhere('user_sessions.status = 1');
      query.andWhere('user.ut_id = 3');

      const results = await query
      .orderBy('user_sessions.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

  async getAllByFilter(page: number, limit: number, search_type : string, search_data : string){

    var start_from = (page-1) * limit;

    const query = this.i_repository.createQueryBuilder('user_sessions');
    query.leftJoinAndMapOne('user_sessions.user_id',UserEntity,'user','user_sessions.user_id = user.id');
    query.leftJoinAndMapOne('user_sessions.package_id',UserPackagesEntity,'user_package','user_sessions.package_id = user_package.id');
    query.leftJoinAndMapOne('user_package.rate_id',RatesEntity,'rate','user_package.rate_id = rate.id');
    query.where('(user_sessions.datetime_added >= CURDATE() - INTERVAL 1 DAY AND user_sessions.datetime_added < CURDATE() + INTERVAL 1 DAY)');
    query.andWhere('user.ut_id = 3');
    
    if(search_type == 'login') query.andWhere('user_sessions.status = 1');
    else if(search_type == 'logout') query.andWhere('user_sessions.status = 0');
    else if(search_type == 'pause') query.andWhere('user_sessions.status = 2');

    const results = await query
    .skip(start_from)
    .take(limit)
    .getManyAndCount();

    if(search_type == 'latest') query.orderBy('user_sessions.datetime_added', 'DESC');
    else if(search_type == 'oldest') query.orderBy('user_sessions.datetime_added', 'ASC');
    else query.orderBy('user_sessions.datetime_added', 'DESC');

    return results;
}

  async getCount(){

    const total_cnt = await this.i_repository.createQueryBuilder("user_sessions")
    .select("COUNT(user_sessions.id)", "cnt")
    .getRawOne();

    return {
      total_cnt : total_cnt.cnt,
    };
}

  async findItem(id : number){

      return await this.i_repository.createQueryBuilder("user_sessions")
      .where("user_sessions.id = :id", {id : id})
      .getOne();
  }

  async addItem(data: UserSessionsEntity): Promise<UserSessionsEntity>{
    
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

  async findItemByUserId(user_id : number){

    return await this.i_repository.createQueryBuilder("user_sessions")
    .leftJoinAndMapOne('user_sessions.package_id',UserPackagesEntity,'package','user_sessions.package_id = package.id')
    .leftJoinAndMapOne('package.user_id',UserEntity,'user','package.user_id = user.id')
    .leftJoinAndMapOne('package.rate_id',RatesEntity,'rate','package.rate_id = rate.id')
    .leftJoinAndMapOne('package.employee_id',UserEntity,'employee','package.employee_id = employee.id')
    .where("user_sessions.user_id = :user_id", {user_id : user_id})
    .getOne();
    
}

async getMaxSession(user_id : number){

  return await this.i_repository.createQueryBuilder("user_sessions")
  .where("user_sessions.user_id = :user_id", {user_id : user_id})
  .orderBy("user_sessions.id", "DESC")
  .limit(1)
  .getOne();

 
}

async getVisits(page: number, limit: number, selected_date : string){

  var start_from = (page-1) * limit;

  const query = this.i_repository.createQueryBuilder('user_sessions');
  query.leftJoinAndMapOne('user_sessions.user_id',UserEntity,'user','user_sessions.user_id = user.id');
  query.leftJoinAndMapOne('user_sessions.package_id',UserPackagesEntity,'user_package','user_sessions.package_id = user_package.id');
  query.leftJoinAndMapOne('user_package.rate_id',RatesEntity,'rate','user_package.rate_id = rate.id');
  query.where('DATE(user_sessions.datetime_added) = DATE(:selected_date)', {selected_date : selected_date});
  query.andWhere('user.ut_id = 3');
  query.distinctOn(['user_sessions.id']);

  const results = await query
  .orderBy('user_sessions.datetime_added', 'DESC')
  .skip(start_from)
  .take(limit) 
  .getManyAndCount();

  return results;
}

async getVisitsByFilter(page: number, limit: number, search_type : string, search_data : string){

  var start_from = (page-1) * limit;

  const query = this.i_repository.createQueryBuilder('user_sessions');
  query.leftJoinAndMapOne('user_sessions.user_id',UserEntity,'user','user_sessions.user_id = user.id');
  query.leftJoinAndMapOne('user_sessions.package_id',UserPackagesEntity,'user_package','user_sessions.package_id = user_package.id');
  query.leftJoinAndMapOne('user_package.rate_id',RatesEntity,'rate','user_package.rate_id = rate.id');
  query.where('(user_sessions.datetime_added >= CURDATE() - INTERVAL 1 DAY AND user_sessions.datetime_added < CURDATE() + INTERVAL 1 DAY)');
  query.andWhere('user.ut_id = 3');
  query.distinctOn(['user_sessions.id']);
  
  // if(search_type == 'login') query.andWhere('user_sessions.status = 1');
  // else if(search_type == 'logout') query.andWhere('user_sessions.status = 0');
  // else if(search_type == 'pause') query.andWhere('user_sessions.status = 2');

  const results = await query
  .skip(start_from)
  .take(limit)
  .getManyAndCount();

  if(search_type == 'latest') query.orderBy('user_sessions.datetime_added', 'DESC');
  else if(search_type == 'oldest') query.orderBy('user_sessions.datetime_added', 'ASC');
  else query.orderBy('user_sessions.datetime_added', 'DESC');

  return results;
}



}


