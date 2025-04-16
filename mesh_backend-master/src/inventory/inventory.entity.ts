import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "inventory"})
export class InventoryEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    product_id: number

    @Column()
    qty: number

    @Column()
    critical_qty: number

    @Column()
    datetime_added: string

    @Column()
    expiration_date: string


}