import { Expose } from 'class-transformer';
import { Category } from 'src/category/entities/category.entity';
import { Session } from 'src/session/entities/session.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
@Entity({ name: 'program' })
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  programCode: string;

  @Column()
  name: string;

  @Column()
  status: string;

  @Column()
  round: string;

  @Column()
  mode: string;

  @Column()
  type: string;

  @Column()
  groupCount: number;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column()
  venue: number;

  @Column()
  curbGroup: string;

  @Column()
  maxCountCurb: number;

  @Column()
  languageGroup: string;

  @Column()
  isRegisterable: string;

  @Column()
  isStarred: string;

  @Column()
  duration: number;

  @Column()
  conceptNote: string;

  @Column()
  resultEntered: string;

  @Column()
  resultPublished: string;

  @Column()
  maxSelection: number;

  @Column()
  categoryByFeatures: string;

  @Column()
  skill: string;

  @ManyToOne(() => Category, (category) => category.programs)
  category: Category;

  @ManyToOne(() => Session, (session) => session.programs)
  session: Session;

  @Expose({ groups: ['single'], name: 'created_at'})
  @CreateDateColumn()
  createdAt: Date;
  
  @Expose({ groups: ['single'], name: 'updated_at'})
  @UpdateDateColumn()
  updatedAt: Date;

  @Expose()
  @DeleteDateColumn()
  deletedAt: Date;
}
