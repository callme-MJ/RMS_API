import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { S3Service } from 'src/candidate/services/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([News])
  ],
  controllers: [MediaController],
  providers: [MediaService,S3Service]
})
export class MediaModule {}
