import { Institute } from 'src/institute/entities/institute.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Coordinator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
  
  @Column()
  username: string;
  
  @Column()
  password: string;

  @Column()
  email: string;
  
  @Column()
  phoneNO: string;
  
  @ManyToOne(() => Institute, (institute) => institute.coordinators)
  institute: Institute;
}