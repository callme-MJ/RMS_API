import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Institute } from '../../institute/entities/institute.entity';
import { Photo } from '../interfaces/photo.entitiy';
import { Category } from 'src/category/entities/category.entity';
import { Session } from 'src/session/entities/session.entity';

@Entity({ name: 'candidate' })
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  class: number;

  @Column()
  adno: number;

  @Column()
  dob: string;

  @Column()
  chestNO: number;

  @ManyToOne(() => Institute, (institute) => institute.candidates)
  institute: Institute;

  @ManyToOne(() => Category)
  category: Category;
  
  @ManyToOne(() => Category)
  session: Session;

  @Column({ nullable: true, type: 'json' })
  photo: Photo;
}
