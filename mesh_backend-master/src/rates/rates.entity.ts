import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "rates"})
export class RatesEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @Column()
    duration: number

    @Column()
    area_id: number

    @Column()
    rate: number

    @Column()
    exceed: number

    @Column()
    datetime_added: string

    @Column()
    type: number

}