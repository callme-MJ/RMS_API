import { String } from 'aws-sdk/clients/acm';
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
  s_time: string;

  @Column({ nullable: true })
  venue: string;

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
  e_time: string;

  @Column({ nullable: true })
  conceptNote: string;

  @Column({ nullable: true })
  resultEntered: string;

  @Column({nullable: true})
  resultPublished: string;

  @Column({nullable: true, default:"false"})
  privatePublished: string;

  @Column({ nullable: true })
  finalResultEntered: string;

  @Column({nullable: true})
  finalResultPublished: string;

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

  @Expose({  name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Expose({  name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;

  @Expose()
  @DeleteDateColumn()
  deletedAt: Date;
}