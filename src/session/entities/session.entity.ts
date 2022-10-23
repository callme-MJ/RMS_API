import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Expose } from 'class-transformer';
import { Institute } from 'src/institute/entities/institute.entity';

export enum SessionStatus {
    INACTIVE,
    ACTIVE
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

    @OneToMany(() => Institute, instiute => instiute.session)
    institutes: Institute[]

    @Expose({ groups: ['single'] })
    @CreateDateColumn()
    createdAt: Date;

    @Expose({ groups: ['single'] })
    @UpdateDateColumn()
    updatedAt: Date;
}