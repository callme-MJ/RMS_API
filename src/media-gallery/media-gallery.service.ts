import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { S3Service } from 'src/candidate/services/s3.service';
import { NotFoundException } from 'src/exceptions/not-found-exception';
import { ValidationException } from 'src/exceptions/validation-exception';
import { Session, SessionStatus } from 'src/session/entities/session.entity';
import { SessionService } from 'src/session/session.service';
import { Repository } from 'typeorm';
import { CreateMediaGalleryDto } from './dto/create-media-gallery.dto';
import { UpdateMediaGalleryDto } from './dto/update-media-gallery.dto';
import { MediaGallery } from './entities/media-gallery.entity';

@Injectable()
export class MediaGalleryService {
  constructor(
    @InjectRepository(MediaGallery)
    private readonly mediaGalleryRepository: Repository<MediaGallery>,
    private readonly sessionService: SessionService,
    private readonly s3Service: S3Service
  ) { }

  public async create(payload: CreateMediaGalleryDto, image: Express.Multer.File): Promise<MediaGallery> {
    try {
      const session: Session = await this.sessionService.findByID(payload.sessionID);

      if(!image) throw new ValidationException("image is required");

      // const newPhoto = await this.mediaGalleryRepository.create(payload)

      const mediagallery: MediaGallery = await this.mediaGalleryRepository.save({ ...payload, session });
      
      return await this.uploadPhoto(mediagallery, image);
    } catch (error) {
      throw error;
    }
  }

  public async findAll(sessionID: number = 0): Promise<MediaGallery[]> {
    try {
      return this.mediaGalleryRepository.find({
        where: {
          session: {
            id: sessionID,
            status: SessionStatus.ACTIVE
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  public async findOne(id: number): Promise<MediaGallery> {
    try {
      const mediaGallery: MediaGallery = await this.mediaGalleryRepository.findOne({
        where: { id }
      });

      if(!mediaGallery) throw new NotFoundException("mediaGallery not found");

      // if(!mediaGallery. || !mediaGallery.session.status) return null;

      return mediaGallery;
    } catch (error) {
      throw error;
    }
  }

  public async update(id: number, payload: UpdateMediaGalleryDto, image?: Express.Multer.File): Promise<boolean> {
    try {
      const session: Session = await this.sessionService.findByID(payload.sessionID);
      const mediaGallery: MediaGallery = await this.findOne(id);

      if(!mediaGallery) throw new NotFoundException("mediaGalley not found");

      if(image) {
        await this.s3Service.deleteFile(mediaGallery.image);
        await this.uploadPhoto(mediaGallery, image);
      }

      await this.mediaGalleryRepository.save({ ...payload, id, session });
      return true;
    } catch (error) {
      throw error;
    }
  }

  public async remove(id: number) {
    try {
      const mediaGallery: MediaGallery = await this.findOne(id);
      await this.s3Service.deleteFile(mediaGallery.image);
      await this.mediaGalleryRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  private async uploadPhoto(mediaGallery: MediaGallery, image: Express.Multer.File) : Promise<MediaGallery> {
    try {
      if(!mediaGallery || !image) return;     

      const ext: string = image.originalname.split('.').pop();
      const uploadedImage: ManagedUpload.SendData = await this.s3Service.uploadFile(image, `mediaGallery-${mediaGallery.id}.${ext}`);
      mediaGallery.image = {
        eTag: uploadedImage.ETag,
        key: uploadedImage.Key,
        url: uploadedImage.Location
      }
      
      return await this.mediaGalleryRepository.save(mediaGallery);
    } catch (error) {
      throw error;
    }
  }
}
