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

  

  @ManyToOne(
    () => Program,
    (program) => program.candidatePrograms
  )
  program: Program;

  @ManyToOne(
    () => Candidate,
    (candidate) => candidate.candidatePrograms
  )
  candidate: Candidate;
}
