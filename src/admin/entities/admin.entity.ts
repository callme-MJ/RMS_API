import { Exclude, Expose } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Expose({ name: 'first_name' })
    @Column()
    firstName: string;
    
    @Expose({ name: 'last_name' })
    @Column()
    lastName: string;

    @Column()
    username: string;

    @Exclude()
    @Column()
    password: string;

    
}