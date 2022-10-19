import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Expose({ name: 'is_current' })
    @Column({ default: true })
    isCurrent: boolean;

    @Expose({ groups:['single'] })
    @CreateDateColumn()
    createdAt: Date;

    @Expose({ groups:['single'] })
    @UpdateDateColumn()
    updatedAt: Date;
}