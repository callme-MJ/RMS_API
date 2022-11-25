import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Judge {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phoneNo: string;

    @Column()
    programs: string;

}
