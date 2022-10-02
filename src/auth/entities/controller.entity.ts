import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
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
  phone_no: string;
  
  @Column()
  institute_id: number;
}