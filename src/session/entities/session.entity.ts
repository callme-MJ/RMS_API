import { Exclude, Expose } from 'class-transformer';
import { Institute } from 'src/institute/entities/institute.entity';
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

  @OneToMany(() => Institute, (instiute) => instiute.session)
  institutes: Institute[];

  @Expose({ groups: ['single'], name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;
}
