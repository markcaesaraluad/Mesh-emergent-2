import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "employee_sessions"})
export class EmployeeSessionsEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column()
    datetime_added: string

    @Column()
    status: number


}