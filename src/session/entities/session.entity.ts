import { Exclude, Expose } from 'class-transformer';
import { Category } from 'src/category/entities/category.entity';
import { Institute } from 'src/institute/entities/institute.entity';
import { Coordinator } from 'src/coordinator/entities/coordinator.entity';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Program } from 'src/program/entities/program.entity';
import { CandidateProgram } from 'src/candidate-program/entities/candidate-program.entity';

export enum SessionStatus {
  INACTIVE,
  ACTIVE,
}

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  status: SessionStatus;

    @Column()
    year: number;
    
    @Expose({ name: 'chest_no_prefix'})
    @Column({ nullable: true })
    chestNoPrefix?: string;
    
    @OneToMany(() => Institute, institute => institute.session)
    institutes: Institute[]

    @OneToMany(() => Program, program => program.session)
    programs: Program[]
    
    @OneToMany(() => Candidate, candidate => candidate.session)
    candidates: Candidate[]

    @OneToMany(() => CandidateProgram, candidateProgram => candidateProgram.session)
    candidatePrograms: CandidateProgram[]

    @OneToMany(() => Coordinator, coordinator => coordinator.session)
    coordinators: Coordinator[]

    @Expose({ groups: ['single'], name: 'created_at' })
    @CreateDateColumn()
    createdAt: Date;

  @Expose({ groups: ['single'], name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @UpdateDateColumn()
  deletedAt: Date;
}
