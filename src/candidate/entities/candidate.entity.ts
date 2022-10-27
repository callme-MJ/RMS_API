import { Exclude, Expose } from 'class-transformer';
import { Category } from 'src/category/entities/category.entity';
import { Session } from 'src/session/entities/session.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Institute } from '../../institute/entities/institute.entity';
import { Photo } from '../interfaces/photo.entitiy';

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
}

@Entity({ name: 'candidate' })
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  class: number;

  @Column()
  adno: number;

  @Column()
  dob: string;

  @Column()
  chestNO: number;

  @Column({ nullable: true, type: 'json' })
  photo: Photo;

  @Column({ type: 'varchar', default: Gender.MALE })
  gender: Gender;

  @ManyToOne(() => Institute, (institute) => institute.candidates,{eager:true})
  institute: Institute;

  @ManyToOne(() => Category)
  category: Category;

  @ManyToOne(() => Session)
  session: Session;

  @Expose({ groups: ['single'], name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Expose({ groups: ['single'], name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date;
}
