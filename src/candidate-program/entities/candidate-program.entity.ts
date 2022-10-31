import { Expose } from 'class-transformer';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { Institute } from 'src/institute/entities/institute.entity';
import { Program } from 'src/program/entities/program.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'candidate_program' })
export class CandidateProgram {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column()
  chestNO: number;

  @Column()
  programCode: string;

  @Column()
  categoryID: number;

  @Column()
  programName: string;

  @Column({ nullable: true })
  topic: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  staus: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  grade: string;

  @Column({ nullable: true })
  point: number;

  @Column({ nullable: true })
  codeLetter: string;

  @Expose({ name: 'is_selected' })
  @Column({ nullable: true })
  isSelected: number;

  @ManyToOne(() => Program, (program) => program.candidatePrograms, {
    eager: true,
  })
  @JoinTable()
  program: Program;

  @ManyToOne(() => Candidate, (candidate) => candidate.candidatePrograms, {
    eager: true,cascade: ['update']
  })
  @JoinTable()
  candidate: Candidate;

  // @ManyToOne(() => Candidate, (candidate) => candidate.candidatePrograms, {
  //   eager: true,cascade: ['update']
  // })
  // @JoinTable()
  // candidate: Candidate;
}
