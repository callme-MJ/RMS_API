import { Expose } from 'class-transformer';
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

  @Column()
  chestNoSeries: number;

  @Expose({ groups: ['single'] })
  @ManyToOne(() => Session, { eager: true })
  session: Session;

  @OneToMany(() => Program, (program) => program.category)
  programs: Program[];
}
