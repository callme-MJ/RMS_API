<<<<<<< HEAD
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';
=======
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,OneToMany } from 'typeorm';
import { Expose } from 'class-transformer';
import { Candidate } from 'src/institute/entities/candidate.entity';
import { Institute } from 'src/institute/entities/institute.entity';
>>>>>>> feature/candidate-registration

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

<<<<<<< HEAD
=======

    @OneToMany( () => Institute, instiute => instiute.session)
    institutes:Institute[]

>>>>>>> feature/candidate-registration
    @Expose({ name: 'is_current' })
    @Column({ default: true })
    isCurrent: boolean;

<<<<<<< HEAD
=======
    @Expose({ name: 'is_NIICS' })
    @Column({ default: false })
    isNIICS: boolean;

>>>>>>> feature/candidate-registration
    @Expose({ groups:['single'] })
    @CreateDateColumn()
    createdAt: Date;

    @Expose({ groups:['single'] })
    @UpdateDateColumn()
    updatedAt: Date;
<<<<<<< HEAD
=======

>>>>>>> feature/candidate-registration
}