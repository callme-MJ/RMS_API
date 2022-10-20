import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,OneToMany } from 'typeorm';
import { Expose } from 'class-transformer';
import { Candidate } from 'src/institute/entities/candidate.entity';
import { Institute } from 'src/institute/entities/institute.entity';

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;


    @OneToMany( () => Institute, instiute => instiute.session)
    institutes:Institute[]

    @Expose({ name: 'is_current' })
    @Column({ default: true })
    isCurrent: boolean;

    @Expose({ name: 'is_NIICS' })
    @Column({ default: false })
    isNIICS: boolean;

    @Expose({ groups:['single'] })
    @CreateDateColumn()
    createdAt: Date;

    @Expose({ groups:['single'] })
    @UpdateDateColumn()
    updatedAt: Date;

}