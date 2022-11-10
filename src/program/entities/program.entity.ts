import { Exclude, Expose } from 'class-transformer';
import { CandidateProgram } from 'src/candidate-program/entities/candidate-program.entity';
import { Category } from 'src/category/entities/category.entity';
import { Session } from 'src/session/entities/session.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
export enum EnteringStatus {
  TRUE = 'True',
  FALSE = 'False',
}
export enum PublishingStatus {
  TRUE = 'True',
  FALSE = 'False',
}
@Entity({ name: 'program' })
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  programCode: string;

  @Column()
  name: string;

  @Column()
  categoryID: number;


  @Column()
  sessionID: number;

  @Column()
  status: string;

  @Column()
  round: string;

  @Column()
  mode: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  groupCount: number;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  time: string;

  @Column({ nullable: true })
  venue: number;

  @Column({ nullable: true })
  curbGroup: string;

  @Column({ nullable: true })
  maxCountCurb: number;

  @Column({ nullable: true })
  languageGroup: string;

  @Column({ nullable: true })
  isRegisterable: string;

  @Column({ nullable: true })
  isStarred: string;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true })
  conceptNote: string;

  @Column({default: EnteringStatus.FALSE})
  resultEntered: EnteringStatus;

  @Column({default: PublishingStatus.FALSE})
  resultPublished: PublishingStatus;

  @Column({ nullable: true })
  maxSelection: number;

  @Column({ nullable: true })
  categoryByFeatures: string;

  @Column({ nullable: true })
  skill: string;

  @OneToMany(() => CandidateProgram, (candidateProgram) => candidateProgram.program)
  candidatePrograms: CandidateProgram[];

  @ManyToOne(() => Category, (category) => category.programs)
  category: Category;

  @ManyToOne(() => Session, (session) => session.programs)
  session: Session;

  @Expose({ groups: ['single'], name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Expose({ groups: ['single'], name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;

  @Expose()
  @DeleteDateColumn()
  deletedAt: Date;
}