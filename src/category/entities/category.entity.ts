import { Expose } from 'class-transformer';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { Program } from 'src/programs/entities/program.entity';
import { Session } from 'src/session/entities/session.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Expose({ name: 'chest_no_series' })
  @Column()
  chestNoSeries: number;

  @Expose({ groups: ['single'] })
  @ManyToOne(() => Session, { eager: true })
  session: Session;

  @OneToMany(() => Program, (program) => program.category)
  programs: Program[];

  @OneToMany(() => Candidate, (Candidate) => Candidate.category)
  candidates: Candidate[];
}
