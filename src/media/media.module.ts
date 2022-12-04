import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { S3Service } from 'src/candidate/services/s3.service';
import { UserMediaController } from './controllers/user-media.controller';
import { PublicMediaController } from './controllers/public-media.controller';
import { Gallery } from './entities/gallery.entity';
import { CandidateProgramService } from 'src/candidate-program/candidate-program.service';
import { CandidateProgram } from 'src/candidate-program/entities/candidate-program.entity';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { CandidateService } from 'src/candidate/services/candidate.service';
import { CandidateProgramModule } from 'src/candidate-program/candidate-program.module';
import { CoordinatorService } from 'src/coordinator/services/coordinator.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media,Gallery]),
    CandidateProgramModule
  ],
  controllers: [UserMediaController,PublicMediaController],
  providers: [MediaService,S3Service]
})
export class MediaModule {}
