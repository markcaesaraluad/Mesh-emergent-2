import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "user_packages"})
export class UserPackagesEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column()
    rate_id: number

    @Column()
    employee_id: number

    @Column()
    datetime_added: string

    @Column()
    isDone: number

    @Column()
    payment: number

    @Column()
    payment_type: number


}