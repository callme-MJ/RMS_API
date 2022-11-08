


// import { Photo } from 'src/media-gallery/interfaces/photo.entity';
// import {
//   Column,
//   Entity
// } from 'typeorm';

// @Entity({ name: 'mediaGallery' })
// export class MediaGallery {
   
//     @Column({ nullable: true, type: 'json' })
//     image: Photo;
// }



import { Session } from 'src/session/entities/session.entity';
import { Photo } from 'src/candidate/interfaces/photo.entitiy';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity({ name: 'mediaGallery' })
export class MediaGallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

 

  @Column({ nullable: true, type: 'json' })
  image: Photo;
  
  @ManyToOne(() => Session, (session) => session.mediaGallery, { eager: true })
  session: Session;
 
}


