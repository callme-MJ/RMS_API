import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'photo' })
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eTag: string;

  @Column()
  key: string;


  @Column()
  url:string
}
