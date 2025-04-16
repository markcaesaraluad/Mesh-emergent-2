import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { UserTypesMenuEntity } from './user_types_menu.entity';
import { UserMenuEntity } from 'src/entities';

@Injectable()
export class UserTypesMenuService {
    constructor(
        @InjectRepository(UserTypesMenuEntity)
        private readonly i_repository: Repository<UserTypesMenuEntity>,
        private dataSource: DataSource
    ) { }

    async getAll(){

        return await this.i_repository.createQueryBuilder("user_types_menu")
        .orderBy('user_types_menu.datetime_added', 'DESC')
        .getMany();
    }

    async getCount(){

        const total_cnt = await this.i_repository.createQueryBuilder("user_types_menu")
        .select("COUNT(user_types_menu.id)", "cnt")
        .getRawOne();
    
        return {
          total_cnt : total_cnt.cnt,
        };
    }

    async getAllByPage(page: number, limit : number){

        var start_from = (page-1) * limit;

        return await this.i_repository.createQueryBuilder("user_types_menu")
        .orderBy('user_types_menu.datetime_added', 'ASC')
        .skip(start_from)
        .take(limit) 
        .getMany();
    }

    async findItem(id : number){

        return await this.i_repository.createQueryBuilder("user_types_menu")
        .where("user_types_menu.id = :id", {id : id})
        .getOne();
    }

    async addItem(user: UserTypesMenuEntity) : Promise<UserTypesMenuEntity>{

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();

        try{

        const res = this.i_repository.save(user);
        await queryRunner.commitTransaction();
        return res;
        
        } catch (err) {
        await queryRunner.rollbackTransaction();
        } finally {
        await queryRunner.release();
        }
    
    }

    async editItem(data:any){


      }

      async assignChild(data:any){

        if(data.type == 1){ //add
            return await this.i_repository.update(data.id, { 
                parent_id : data.parent_id,
                position : data.position
              });
        
        }
        else{ //remove
            return await this.i_repository.update(data.id, { 
                parent_id : 0,
                position : 1,
              });
        }

          
          }

      async deleteItem(data:any){

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();

        try{

        const res = this.i_repository.delete(data.id);
        await queryRunner.commitTransaction();
        return res;
        
        } catch (err) {
        await queryRunner.rollbackTransaction();
        } finally {
        await queryRunner.release();
        }

        
  
        }


        async searchName(name : string){

            return await this.i_repository.createQueryBuilder("user_types_menu")
            .where("user_types_menu.name LIKE :name OR user_types_menu.abbre LIKE :name", {name : `%${name}%`})
            .getMany();
        }

        async getMenu(id : number){

            return await this.i_repository.createQueryBuilder("user_types_menu")
            .leftJoinAndMapOne('user_types_menu.um_id',UserMenuEntity,'menu','user_types_menu.um_id = menu.id')
            .where("user_types_menu.ut_id = :id", {id : id})
            .getMany();
        }

        async checkPrivilege(data : any){

            const check_data = await this.i_repository.createQueryBuilder("user_types_menu")
            .select("COUNT(user_types_menu.id)", "cnt")
            .leftJoinAndMapOne('user_types_menu.um_id',UserMenuEntity,'menu','user_types_menu.um_id = menu.id')
            .where("user_types_menu.ut_id = :ut_id AND menu.link = :link", {ut_id : data.ut_id, link : data.link})
            .getRawOne();

            return {
                check_data : check_data.cnt,
            };

            // return await this.i_repository.createQueryBuilder("user_types_menu")
            // .leftJoinAndMapOne('user_types_menu.um_id',UserMenuEntity,'menu','user_types_menu.um_id = menu.id')
            // .where("user_types_menu.ut_id = :ut_id AND menu.title = :link_name", {ut_id : ut_id, link_name : link_name})
            // .getOne();
        }

        async searchNameNav(name : string, ut_id : number){

            return await this.i_repository.createQueryBuilder("user_types_menu")
            .leftJoinAndMapOne('user_types_menu.um_id',UserMenuEntity,'menu','user_types_menu.um_id = menu.id')
            .where("menu.name LIKE :name AND user_types_menu.ut_id = :ut_id", {name : `%${name}%`, ut_id : ut_id})
            .getMany();
        }

        async getListDataClick(ut_id : number){

            return await this.i_repository.createQueryBuilder("user_types_menu")
            .leftJoinAndMapOne('user_types_menu.um_id',UserMenuEntity,'menu','user_types_menu.um_id = menu.id')
            .where("user_types_menu.ut_id = :ut_id", {ut_id : ut_id})
            .orderBy('menu.name', 'ASC')
            .getMany();
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
