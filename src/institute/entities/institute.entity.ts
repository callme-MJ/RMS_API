import { Exclude, Expose } from 'class-transformer';
import { CandidateProgram } from 'src/candidate-program/entities/candidate-program.entity';
import { Photo } from 'src/candidate/interfaces/photo.entitiy';
import { Coordinator } from 'src/coordinator/entities/coordinator.entity';
import { Session } from 'src/session/entities/session.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Candidate } from '../../candidate/entities/candidate.entity';

@Entity({ name: 'institute' })
export class Institute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  shortName: string;

  @Column()
  address: string;

  @Column({ nullable: true, type: 'json' })
  coverPhoto: Photo;

  @OneToMany(() => Candidate, (candidate) => candidate.institute)
  candidates: Candidate[];



  @OneToMany(() => Coordinator, (coordinator) => coordinator.institute)
  coordinators: Coordinator[];

  @OneToMany(() => CandidateProgram, (candidateProgram) => candidateProgram.institute)
  candidatePrograms: CandidateProgram[];


  @ManyToOne(() => Session, (session) => session.institutes, { eager: true })
  session: Session;

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
