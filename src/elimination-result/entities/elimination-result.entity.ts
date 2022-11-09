import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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



}