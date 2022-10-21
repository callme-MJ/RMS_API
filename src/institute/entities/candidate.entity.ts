import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Institute } from './institute.entity';
import { Photo } from './photo.entitiy';

@Entity({ name: 'candidate' })
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  instituteID: string;

  @Column()
  name: string;

  @Column()
  categoryID: string;

  @Column()
  class: number;

  @Column()
  adno: number;

  @Column()
  dob: string;

  @Column()
  chestNO: string;

  @Column()
  photoPath: string;

  @Column()
  photoKey: string;

  @Column()
  photoETag: string;

  @ManyToOne(() => Institute, (institute) => institute.candidates)
  institute: Institute;

  
  // @OneToOne(() => Photo)
  // @JoinColumn()
  // photo: Photo
}
