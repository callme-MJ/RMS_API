import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { S3Service } from 'src/candidate/services/s3.service';
import { UserMediaController } from './controllers/user-media.controller';
import { PublicMediaController } from './controllers/public-media.controller';
import { Gallery } from './entities/gallery.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media,Gallery])
  ],
  controllers: [UserMediaController,PublicMediaController],
  providers: [MediaService,S3Service]
})
export class MediaModule {}
