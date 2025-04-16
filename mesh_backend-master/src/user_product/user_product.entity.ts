import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "user_product"})
export class UserProductEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    package_id: number

    @Column()
    product_id: number

    @Column()
    qty: number

    @Column()
    total: number

    @Column()
    datetime_added: string

}