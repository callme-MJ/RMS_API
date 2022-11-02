import { Module } from '@nestjs/common';
import { MediaGalleryService } from './media-gallery.service';
import { MediaGalleryController } from './media-gallery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from 'src/candidate/services/s3.service';
import { MediaGallery } from './entities/media-gallery.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaGallery])
  ],
  controllers: [MediaGalleryController],
  providers: [MediaGalleryService, S3Service, ],
  exports: [MediaGalleryService]
})
export class MediaGalleryModule { }