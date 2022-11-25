import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Judge {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phoneNo: string;

}
