import { type } from 'os';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Institute } from './institute.entity';

@Entity({ name: 'candidate' })
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  institute_ID: string;

  @Column()
  name: string;

  @Column()
  category_ID: string;

  @Column()
  class: number;

  @Column()
  ad_no: number;

  @Column()
  dob: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  photoPath: string;

  @Column()
  chest_No: number;

  // @OneToMany(() => candidate_program, candidate_Program => candidate_Program.candidate )
  // candidate_program: candidate_program[];

  @ManyToOne( (type)=> Institute, (institute) => institute.candidates)
  institute: Institute
} 
