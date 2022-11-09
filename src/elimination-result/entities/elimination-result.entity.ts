import { CandidateProgram } from "src/candidate-program/entities/candidate-program.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "elimination_result" })
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
insstituteID: number;

@Column()
programCode: string;

@Column()
candidateName: string;

@Column()
programName: string;

@Column()
pointOne: number;

@Column({ nullable: true })
pointTwo: number;

@Column({ nullable: true })
pointThree: number;

@Column()
totalPoint: number;

@Column({nullable:true})
remarks: string;

@OneToOne(() => CandidateProgram, (candidateProgram) => candidateProgram.eliminationResult)
candidateProgram: CandidateProgram;


}