import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { S3Service } from 'src/candidate/services/s3.service';
import { UserMediaController } from './controllers/user-media.controller';
import { PublicMediaController } from './controllers/public-media.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([News])
  ],
  controllers: [UserMediaController,PublicMediaController],
  providers: [MediaService,S3Service]
})
export class MediaModule {}
