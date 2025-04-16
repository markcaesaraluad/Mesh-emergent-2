import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "user_sessions"})
export class UserSessionsEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column()
    package_id: number

    @Column()
    datetime_added: string

    @Column()
    status: number

    @Column()
    remarks: string

    @Column()
    area_seat_num: number

   

}