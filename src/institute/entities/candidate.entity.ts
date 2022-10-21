import {
  Column,
  Entity, ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Institute } from './institute.entity';

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

  @Column({ type: 'varchar', length: 300, nullable: true })
  photoPath: string;

  @Column()
  chestNO: string;

  @ManyToOne(() => Institute, (institute) => institute.candidates)
  institute: Institute;
}
