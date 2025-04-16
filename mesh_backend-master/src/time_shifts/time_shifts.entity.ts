import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "time_shifts"})
export class TimeShiftsEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    time_start: string

    @Column()
    time_end: string

    @Column()
    description: string

}