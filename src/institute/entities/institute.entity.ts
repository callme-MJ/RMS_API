import { type } from 'os';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
  cover_Photo: string;

  @Column()
  is_Nics: string;

  @Column()
  session_ID: string;

  @OneToMany( (type) => Candidate, candidate => candidate.institute)
  candidates:Candidate[]

}
