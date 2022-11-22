import { CandidateProgram } from 'src/candidate-program/entities/candidate-program.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Final_result' })
export class FinalResult {
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

  @Column("decimal", { precision: 5, scale: 2 })
  pointOne: number;

  @Column("decimal", { precision: 5, scale: 2, default:"0"})
  pointTwo: number;

  @Column("decimal", { precision: 5, scale: 2, default:"0"})
  pointThree: number;

  @Column("decimal", { precision: 5, scale: 2 })
  totalPoint: number;

  @Column("decimal", { precision: 5, scale: 2 })
  percentage: number;

  @Column({ nullable: true })
  remarks: string;

  @OneToOne( type => CandidateProgram ,{eager:true})
  @JoinColumn()
  candidateProgram: CandidateProgram;
}
