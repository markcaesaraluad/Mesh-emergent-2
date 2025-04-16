import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "user_wallet_transaction"})
export class UserWalletTransactionEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column()
    input_credit: number

    @Column()
    isApproved: number

    @Column()
    datetime_added: string

    @Column()
    file_attachment: string

}