import { Expose } from "class-transformer";
import { Session } from "src/session/entities/session.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    chestNoSeries: number;

    @Expose({ groups: ['single'] })
    @ManyToOne(() => Session, { eager: true })
    session: Session;
}
