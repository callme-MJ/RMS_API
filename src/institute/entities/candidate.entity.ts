import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Institute } from './institute.entity';
import { Photo } from './photo.entitiy';

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
  chestNO: string;

  @ManyToOne(() => Institute, (institute) => institute.candidates)
  institute: Institute;

  @Column({ nullable: true, type: 'json' })
  photo: Photo;
}
