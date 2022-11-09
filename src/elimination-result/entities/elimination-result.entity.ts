import { CandidateProgram } from 'src/candidate-program/entities/candidate-program.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'elimination_result' })
export class EliminationResult {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column()
  chestNO: number;

  @Column()
  categoryID: number;

  @Column()
  instituteID: number;

  @Column()
  programCode: string;

  @Column()
  candidateName: string;

  @Column()
  programName: string;

  @Column()
  pointOne: number;

  @Column({default: 0})
  pointTwo: number;

  @Column({default: 0})
  pointThree: number;

  @Column()
  totalPoint: number;

  @Column({ nullable: true })
  remarks: string;

  @OneToOne( type => CandidateProgram)
  @JoinColumn()
  candidateProgram: CandidateProgram;
}
