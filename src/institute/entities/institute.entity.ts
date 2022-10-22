import { Session } from 'src/session/entities/session.entity';
import {
  Column,
  Entity, ManyToOne, OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Candidate } from './candidate.entity';

@Entity({ name: 'institute' })
export class Institute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  coverPhoto: string;

  @OneToMany(() => Candidate, (candidate) => candidate.institute)
  candidates: Candidate[];

  @ManyToOne(() => Session, (session) => session.institutes)
  session: Session;
}
