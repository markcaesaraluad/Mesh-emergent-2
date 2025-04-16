import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "inventory_logs"})
export class InventoryLogsEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    inventory_id: number

    @Column()
    qty: number

    @Column()
    action: string

    @Column()
    user_id: number

    @Column()
    datetime_added: string

}