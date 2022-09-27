import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"candidate"})
export class candidate{
    @PrimaryGeneratedColumn({
        type:"bigint",
        name:"id",
        
    })
    id:number;

    @Column({
        nullable:false,
    })
    institute_Id:string

   
    @Column({
        nullable:false,
    })
    name:string;

    @Column({
        nullable:false,
    })
    category_Id:string;

    @Column({
        nullable:false,
    })
    class:number;

    @Column({
        nullable:false,
    })
    ad_no:number;

    @Column({
        nullable:false,
        default:"0-0-0"
    })
    dob:string;

    @Column({
        nullable:false,
    })
    photo:string;

}