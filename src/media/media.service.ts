import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { CandidateProgramService } from 'src/candidate-program/candidate-program.service';
import { CandidateService } from 'src/candidate/services/candidate.service';
import { S3Service } from 'src/candidate/services/s3.service';
import { Repository } from 'typeorm';
import { CreateGalleryDTO } from './dto/create-gallery.dto';
import { CreateMediaDTO } from './dto/create-media.dto';
import { UpdateNewsDTO } from './dto/update-media.dto';
import { Gallery } from './entities/gallery.entity';
import { Media } from './entities/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
    @InjectRepository(Gallery)
    private readonly galleryRepo: Repository<Gallery>,
    private readonly s3Service: S3Service,
  ) { }

  async create(createMediaDTO: CreateMediaDTO, file: Express.Multer.File) {
    const newMedia = this.mediaRepo.create(createMediaDTO);
    await this.mediaRepo.save(newMedia);

    await this.uploadMedia(newMedia, file);

    return newMedia;
  }

  async createGallery(createGalletyDTO: CreateGalleryDTO, file: Express.Multer.File) {
    const newImage = this.galleryRepo.create(createGalletyDTO);
    await this.galleryRepo.save(newImage);

    await this.uploadGalleryImage(newImage, file);

    return newImage;
  }

  findAll() {
    return this.mediaRepo.find();
  }

  findAllGallery() {
    return this.galleryRepo.find();
  }

  findOne(slug: string) {
    return this.mediaRepo.findOne({ 
      where:{
        slug:slug
      }
     });
  }

  findOneImage(id: number) {
    return this.galleryRepo.findOneBy({ id });
  }
  
  update(id: number, updateNewsDTO: UpdateNewsDTO) {
    return this.mediaRepo.update(id, updateNewsDTO);
  }

  async remove(id: number) {
    try {
      let media = await this.mediaRepo.findOneBy({id});
      await this.s3Service.deleteFile(media.file);
      return  this.mediaRepo.delete(id);
    } catch (error) {
      throw error;
    }
  }

 async removeGallery(id: number) {
    let gallery = await this.galleryRepo.findOneBy({id});
    await this.s3Service.deleteFile(gallery.file);
    return this.galleryRepo.delete(id);
  }

  async likeImage(id: number) {
    return await this.galleryRepo.increment({ id }, 'likes', 1);
  }

  async unLikeImage(id: number) {
    return await this.galleryRepo.decrement({ id }, 'likes',1);
  }

  private async uploadMedia(
    media: Media,
    photo: Express.Multer.File,
  ): Promise<Media> {
    try {
      if (!media || !photo) return;
      const ext: string = photo.originalname.split('.').pop();
      const uploadedFile: ManagedUpload.SendData =
        await this.s3Service.uploadFile(photo, `mediafile-${media.id}.${ext}`);
      media.file = {
        eTag: uploadedFile.ETag,
        key: uploadedFile.Key,
        url: uploadedFile.Location,
      };

      await this.mediaRepo.save(media);
      console.log('uploading photo');
      return media;
    } catch (error) {
      throw error;
    }
  }

  private async uploadGalleryImage(
    gallery:Gallery,
    photo: Express.Multer.File,
  ): Promise<Gallery> {
    try {
      if (!gallery || !photo) return;
      const ext: string = photo.originalname.split('.').pop();
      const uploadedFile: ManagedUpload.SendData =
        await this.s3Service.uploadFile(photo, `mediafile-${gallery.id}.${ext}`);
      gallery.file = {
        eTag: uploadedFile.ETag,
        key: uploadedFile.Key,
        url: uploadedFile.Location,
      };
      await this.galleryRepo.save(gallery);
      console.log('uploading photo');
      return gallery;
    } catch (error) {
      throw error;
    }
  }
}
