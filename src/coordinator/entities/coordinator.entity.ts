import { Expose } from "class-transformer";
import { Photo } from "src/candidate/interfaces/photo.entitiy";
import { Institute } from "src/institute/entities/institute.entity";
import { Session } from "src/session/entities/session.entity";
import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'coordinator' })
export class Coordinator {

    @PrimaryGeneratedColumn()
    id: number;

    @Expose({ name: 'first_name' })
    @Column()
    firstName: string;

    @Expose({ name: 'last_name' })
    @Column()
    lastName: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Expose({ name: 'phone_no' })
    @Column()
    phoneNO: string

    @Column({ nullable: true, type: 'json' })
    photo: Photo;

    @Expose({ name: 'institute_id' })
    @ManyToOne(() => Institute, (institute) => institute.coordinators, { eager: true })
    institute: Institute;

    @Expose({ name: 'session_id' })
    @ManyToOne(() => Session, (session) => session.coordinators)
    session: Session;
}