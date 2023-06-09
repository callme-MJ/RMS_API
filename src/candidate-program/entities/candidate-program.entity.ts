import { Exclude, Expose } from 'class-transformer';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { Institute } from 'src/institute/entities/institute.entity';
import { Program } from 'src/program/entities/program.entity';
import { Session } from 'src/session/entities/session.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToOne, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
export enum Status {
  Pending = 'P',
  Approved = 'A',
  Rejected = 'R',
  NotSubmitted = 'N',
}
export enum SelectionStatus {
  TRUE = 'True',
  FALSE = 'False',
}

export enum Position {
  First = 'First',
  Second = 'Second',
  Third = 'Third',
  None = 'None',
}

export enum Grade {
  A = 'A',
  B = 'B',
  None = 'None',
}

export enum RoundStatus {
  Elimination = 'Elimination',
  Final = 'Final',
}
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

  @Column({ type: 'varchar', default: Status.NotSubmitted })
  status: Status;

  @Column({ nullable: true, default: Position.None })
  position: string;

  @Column({ nullable: true, default: Grade.None })
  grade: string;

  @Column({ nullable: true })
  postionPoint: number;

  @Column({ nullable: true })
  gradePoint: number;

  @Column({ nullable: true ,default:0})
  point: number;

  @Column({ nullable: true })
  codeLetter: string;

  @Expose({ name: 'is_selected' })
  @Column({ nullable: true, default: SelectionStatus.FALSE })
  isSelected: SelectionStatus;

  @ManyToOne(() => Program, (program) => program.candidatePrograms, {
    eager: true,
  })
  @JoinTable()
  program: Program;

  @ManyToOne(() => Candidate, (candidate) => candidate.candidatePrograms, {
    eager: true,
  })
  @JoinTable()
  candidate: Candidate;

  @ManyToOne(() => Institute, (institute) => institute.candidatePrograms, {
    eager: true,
  })
  institute: Institute;

  @ManyToOne(() => Session, (session) => session.candidatePrograms, {
    eager: true,
  })
  @JoinTable()
  session: Session;

  @Column({ nullable: true })
  round: RoundStatus;

  @Expose({ groups: ['single'], name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Expose({ groups: ['single'], name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
