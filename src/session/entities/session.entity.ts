import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Expose } from 'class-transformer';
import { Institute } from 'src/institute/entities/institute.entity';
import { Coordinator } from 'src/coordinator/entities/coordinator.entity';

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
    
    @Expose({ name: 'chest_no_prefix'})
    @Column({ nullable: true })
    chestNoPrefix?: string;
    
    @OneToMany(() => Institute, institute => institute.session)
    institutes: Institute[]

    @OneToMany(() => Coordinator, coordinator => coordinator.session)
    coordinators: Coordinator[]

    @Expose({ groups: ['single'], name: 'created_at' })
    @CreateDateColumn()
    createdAt: Date;

    @Expose({ groups: ['single'], name: 'updated_at' })
    @UpdateDateColumn()
    updatedAt: Date;
}