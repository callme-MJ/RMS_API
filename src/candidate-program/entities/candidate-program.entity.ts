import { Expose } from 'class-transformer';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { Program } from 'src/programs/entities/program.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  categoryID: string;

  @Column()
  name: string;

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
  program: Program;

  @ManyToOne(() => Candidate, (candidate) => candidate.candidatePrograms)
  candidate: Candidate;
}
