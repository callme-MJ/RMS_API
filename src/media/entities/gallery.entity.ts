import { json } from "stream/consumers";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Files } from "./file.interface";

@Entity()   
 export class Gallery {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    imageCaption: string;

    @Column()
    location: string;
    
    @Column()
    tag: string;

    @Column({nullable: true,default:0})
    likes: number;

    @Column({type:'json',nullable:true})
    file: Files
     

}