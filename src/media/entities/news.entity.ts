import { Photo } from 'src/candidate/interfaces/photo.entitiy';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  heading: string;

  @Column("longtext")
  content: string;

  @Column({ nullable: true, type: 'json' })
  photo: Photo;

  @Column()
  imageCaption: string;

  @Column()
  tag: string;
}
