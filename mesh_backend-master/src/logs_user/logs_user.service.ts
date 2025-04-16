import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { LogsUserEntity } from './logs_user.entity';

@Injectable()
export class LogsUserService {
    constructor(
        @InjectRepository(LogsUserEntity)
        private readonly i_repository: Repository<LogsUserEntity>,
        private dataSource: DataSource
    ) { }

    async getAll(){

        return await this.i_repository.createQueryBuilder("offices")
        .orderBy('offices.description', 'ASC')
        .getMany();
    }

    async findTypeUser(id : number){

        return await this.i_repository.createQueryBuilder("offices")
        .where("offices.id = :id", {id : id})
        .getOne();
    }

    // async assignUserRole(user: UserrolesEntity) : Promise<UserTypesEntity>{
    //     return await this.i_repository.save(user);
    // }

    // async activateUserRole(activateData:any){

    //   return await this.i_repository.update(activateData.id, { 
    //     status: activateData.status 
    //   });

    //   }

}
