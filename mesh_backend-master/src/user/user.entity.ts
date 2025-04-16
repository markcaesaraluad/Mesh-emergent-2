import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "user"})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'varchar', length: 255, unique: true })
    user_id: string

    @Column()
    fname: string

    @Column({ nullable: true })
    mname: string

    @Column()
    lname: string

    @Column({ nullable: true, default: '-' })
    suffix: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string
    
    @Column()
    contact_num: string

    @Column()
    address: string

    @Column({ unique: true })
    username: string

    @Column()
    datetime_added: string

    @Column()
    u_type: number

    @Column()
    ut_id: number

    @Column({ default: 'default_pic.png' })
    profile_pic: string

    @Column({ default: 0 })
    status: number

    @Column({ nullable: true })
    qr_img: string

    @Column({ nullable: true })
    qr_txt: string

    @Column({ default: 0 })
    isApproved: number

    @Column({ default: 0 })
    credits: number
}