import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Candidate } from './candidate.entity';

@Entity({ name: 'photo' })
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eTag: string;

  @Column()
  key: string;

  @Column()
  location: string;

//   @OneToOne(() => Candidate, (candidate) => candidate.photo) 
//   candidate: Candidate;
}
