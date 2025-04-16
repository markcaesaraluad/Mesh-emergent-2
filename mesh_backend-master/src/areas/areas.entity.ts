import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "areas"})
export class AreasEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @Column()
    datetime_added: string

    @Column()
    profile_pic: string

    @Column()
    status: number

    @Column()
    seat_pic: string

}