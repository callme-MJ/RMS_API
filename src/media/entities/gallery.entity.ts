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

    @Column({type:'json'})
    file: Files
     

}