import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { encodePassword } from "src/utils/bcrypt";
import { UserTypesEntity, NotificationsEntity } from "src/entities";
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private i_repository: Repository<UserEntity>,
        private dataSource: DataSource,
        private eventEmitter: EventEmitter2,


    ) { }

    async getAllPending(page: number, limit: number, name : string){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('user');
      
      query.leftJoinAndMapOne('user.ut_id',UserTypesEntity,'user_type','user.ut_id = user_type.id');
      query.where("user_type.description LIKE :name", {name : `%${name}%`});
      query.andWhere("user.isApproved = 0");

      const results = await query
      .orderBy('user.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

    async getAll(page: number, limit: number, name : string){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('user');
      
      query.leftJoinAndMapOne('user.ut_id',UserTypesEntity,'user_type','user.ut_id = user_type.id')
      query.where("user_type.description LIKE :name", {name : `%${name}%`})

      const results = await query
      .orderBy('user.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

  async getAllPendingFilter(page: number, limit: number, name : string, search_type : string, search_data : string){
        
    var start_from = (page-1) * limit;

    const query = this.i_repository.createQueryBuilder('user');
      
      query.leftJoinAndMapOne('user.ut_id',UserTypesEntity,'user_type','user.ut_id = user_type.id');
      query.where("user_type.description LIKE :name", {name : `%${name}%`});
      query.andWhere("user.isApproved = 0");

      if(search_type == 'search') query.andWhere('(user.lname LIKE :search_data OR user.fname LIKE :search_data) AND user_type.description LIKE :name', {search_data : `%${search_data}%`,name : `%${name}%`});
      // if(search_type == 'month') {
      //     var data = search_data.split("-");
      //     var year = data[0], month = data[1];
      //     query.andWhere('MONTH(records.datetime_added) = :month AND YEAR(records.datetime_added)', {month : month, year : year});
      // }

      const results = await query
      .orderBy('user.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
        
    }

  async getAllFilter(page: number, limit: number, name : string, search_type : string, search_data : string){
        
    var start_from = (page-1) * limit;

    const query = this.i_repository.createQueryBuilder('user');
      
      query.leftJoinAndMapOne('user.ut_id',UserTypesEntity,'user_type','user.ut_id = user_type.id')
      query.where("user_type.description LIKE :name", {name : `%${name}%`})

      if(search_type == 'search') query.andWhere('(user.lname LIKE :search_data OR user.fname LIKE :search_data) AND user_type.description LIKE :name', {search_data : `%${search_data}%`,name : `%${name}%`});
      // if(search_type == 'month') {
      //     var data = search_data.split("-");
      //     var year = data[0], month = data[1];
      //     query.andWhere('MONTH(records.datetime_added) = :month AND YEAR(records.datetime_added)', {month : month, year : year});
      // }

      const results = await query
      .orderBy('user.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
        
    }

  async getCount(){

    const total_cnt = await this.i_repository.createQueryBuilder("user")
    .select("COUNT(user.id)", "cnt")
    .getRawOne();

    return {
      total_cnt : total_cnt.cnt,
    };
}

  async findItem(id : number){

      return await this.i_repository.createQueryBuilder("user")
      .where("user.id = :id", {id : id})
      .getOne();
  }

  async searchName(name : string){

    return await this.i_repository.createQueryBuilder("user")
    .where("user.lname LIKE :name OR user.fname LIKE :name", {name : `%${name}%`})
    .getMany();
}

private async getNextUserId(queryRunner): Promise<string> {
  const lastUser = await queryRunner.manager
    .createQueryBuilder(UserEntity, 'user')
    .orderBy('user.user_id', 'DESC')
    .getOne();

  if (!lastUser) {
    return 'MC-1000000001';
  }

  const lastNumber = parseInt(lastUser.user_id.split('-')[1]);
  const nextNumber = lastNumber + 1;
  return `MC-${nextNumber}`;
}


async registerUser(userData: Partial<UserEntity>): Promise<UserEntity> {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const requiredFields = [
      'fname', 'lname', 'username', 'email', 'password', 
      'u_type', 'ut_id', 'contact_num', 'address'
    ];
    
    for (const field of requiredFields) {
      if (!userData[field]) {
        throw new BadRequestException(`Missing required field: ${field}`);
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new BadRequestException('Invalid email format');
    }

    const mysqlDatetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const nextUserId = await this.getNextUserId(queryRunner);

    const userRepository = queryRunner.manager.getRepository(UserEntity);
    const user = userRepository.create({
      user_id: nextUserId,
      fname: userData.fname,
      mname: userData.mname?.trim() || '',
      lname: userData.lname,
      suffix: userData.suffix?.trim() || '-',
      email: userData.email,
      password: encodePassword(userData.password), 
      contact_num: userData.contact_num,
      address: userData.address,
      username: userData.username,
      datetime_added: mysqlDatetime,
      u_type: userData.u_type,
      ut_id: userData.ut_id,
      profile_pic: userData.profile_pic || 'default_pic.png',
      status: typeof userData.status === 'number' ? userData.status : 0,
      qr_txt: null,
      qr_img: null,
      isApproved: 0,
      credits: typeof userData.credits === 'number' ? userData.credits : 0,
    });

    console.log('Processed userData:', JSON.stringify(user, null, 2));

    const savedUser = await userRepository.save(user);
    await queryRunner.commitTransaction();

    

    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as UserEntity;

  } catch (error) {
    await queryRunner.rollbackTransaction();
    
    if (error instanceof BadRequestException) {
      throw error;
    }

    if (error.code === 'ER_DUP_ENTRY') {
      if (error.message.includes('email')) {
        throw new BadRequestException('This email is already registered');
      } else if (error.message.includes('username')) {
        throw new BadRequestException('This username is already taken');
      } else if (error.message.includes('user_id')) {
        throw new InternalServerErrorException('Error generating user ID. Please try again.');
      }
    }

    if (error.code === 'ER_DATA_TOO_LONG') {
      throw new BadRequestException('One or more fields exceed maximum length');
    }

    console.error('User registration error:', {
      code: error.code,
      message: error.message,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState
    });

    throw new InternalServerErrorException(
      `Failed to register user: ${error.sqlMessage || error.message}`
    );

  } finally {
    await queryRunner.release();
  }
}
    checkEmailExisted(email:string): Promise<UserEntity>{
        // const response = this.i_repository.findOneBy({email});
        // return response;

        return this.i_repository.createQueryBuilder("user")
        .leftJoinAndMapOne('user.ut_id',UserTypesEntity,'user_type','user.ut_id = user_type.id')
        .where("user.email  = :email", {email : email})
        .getOne();
      }

      async checkIfApproved(email : string){
        //return this.todoRepository.findBy(id);
        
        return await this.i_repository.createQueryBuilder("user")
        .select(["user"])
        .where("user.email  = :email AND user.isApproved = :isApproved", {email : email, isApproved : 1})
        .getOne();
    }
    
      async checkIfActive(email : string){
        //return this.todoRepository.findBy(id);
        
        return await this.i_repository.createQueryBuilder("user")
        .select(["user"])
        .where("user.email  = :email AND user.status = :status", {email : email, status : 1})
        .getOne();
      }

      async updateProfilePic(data:any){

        return await this.i_repository.update(data.id, { 
          profile_pic: data.profile_pic,
        });
    
      }

      async findItemByNumber(user_id : string){

        return await this.i_repository.createQueryBuilder("user")
        .where("user.user_id = :user_id", {user_id : user_id})
        .getOne();
    }

    async updateUser(data:any){

      return await this.i_repository.update(data.id, { 
        fname: data.fname,
        mname: data.mname,
        lname: data.lname,
        suffix: data.suffix ?? null,
        email: data.email,
        contact_num: data.contact_num,
        address: data.address,
        username: data.username,
        u_type: data.u_type,
        status : data.status,
      });
  
    }

    async updateCredit(data: any) {
      try {
        // Update the user's credits
        const res = await this.i_repository.update(data.id, { 
          credits: data.credits,
        });
    
        // Double check that user_id exists in data
        if (!data.user_id) {
          // If data.user_id is missing, try to fetch it from the repository
          const creditRecord = await this.i_repository.findOne({
            where: { id: data.id }
          });
          
          if (creditRecord && creditRecord.user_id) {
            data.user_id = creditRecord.user_id;
          } else {
            throw new Error('Cannot find user_id for this credit record');
          }
        }
    
        // Log the user_id for debugging
        console.log('Creating notification for user_id:', data.user_id);
        
        // Create notification with explicit properties
        const notification = new NotificationsEntity();
        notification.sender_id = 1;
        notification.user_id = data.id;
        notification.hasRead = 0;
        notification.description = `Your wallet has been approved and updated.`;
        notification.datetime_added = new Date();
        
        // Save notification
        const savedNotif = await this.dataSource.manager.save(NotificationsEntity, notification);
        
        // Emit notification event
        this.eventEmitter.emit('on_create_notif', { 
          userID: data.user_id,
          notif: savedNotif 
        });
    
        return res;
      } catch (error) {
        console.error('Error in updateCredit:', error);
        throw error;
      }
    }

    async updateStatus(data:any){

      return await this.i_repository.update(data.id, { 
        isApproved: data.isApproved,
      });
  
    }

}
