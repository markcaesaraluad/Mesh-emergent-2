import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "products"})
export class ProductsEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @Column()
    price: number

    @Column()
    srp: number

    @Column()
    datetime_added: string

}