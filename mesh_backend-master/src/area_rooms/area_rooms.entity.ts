import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "area_rooms"})
export class AreaRoomsEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    area_id: number

    @Column()
    num: number

    @Column()
    datetime_added: string


}