import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "area_rooms_reservation"})
export class AreaRoomsReservationEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column()
    area_id: number

    @Column()
    rate_id: number

    @Column()
    area_room_id: number

    @Column()
    status: number

    @Column()
    amount_paid: number

    @Column()
    payment_type: number

    @Column()
    file_attachment: string

    @Column()
    datetime_reserved: string

    @Column()
    datetime_added: string


}