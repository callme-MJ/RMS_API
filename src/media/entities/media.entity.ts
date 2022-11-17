import { Files } from './file.interface';
import { Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string

  @Column()
  heading: string;

  @Column({nullable:true})
  slug: string

  @Column({ nullable: true, type: "longtext" })
  content: string;

  @Column({ nullable: true, type: 'json' })
  file: Files;

  @Expose({name: 'youtube_link' })
  @Column({nullable:true})
  youtubeLink:string;

  @Column({ nullable: true })
  imageCaption: string;

  @Column({ nullable: true })
  tag: string;

  @Expose({ groups: ['single'], name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;
}
