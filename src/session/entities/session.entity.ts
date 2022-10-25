import { Exclude, Expose } from 'class-transformer';
import { Category } from 'src/category/entities/category.entity';
import { Institute } from 'src/institute/entities/institute.entity';
import { Program } from 'src/programs/entities/program.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

export enum SessionStatus {
  INACTIVE,
  ACTIVE,
}

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  status: SessionStatus;

  @Column()
  year: number;

  @Expose({ name: 'chest_no_prefix' })
  @Column({ nullable: true })
  chestNoPrefix?: string;

  @OneToMany(() => Program, (program) => program.session)
  programs: Program[];

  @OneToMany(() => Institute, (instiute) => instiute.session)
  institutes: Institute[];

  @OneToMany(() => Category, (category) => category.session)
  category: Category[];

  @Expose({ groups: ['single'], name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Expose({ groups: ['single'], name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @UpdateDateColumn()
  deletedAt: Date;
}
