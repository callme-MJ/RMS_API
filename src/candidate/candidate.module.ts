import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCandidatesController } from './controllers/admin-candidate.controller';
import { CandidateService } from './services/candidate.service';
import { Candidate } from './entities/candidate.entity';
import { S3Service } from './services/s3.service';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Candidate]),
    CategoryModule
  ],
  controllers: [AdminCandidatesController],
  providers: [CandidateService, S3Service]
})
export class CandidateModule { }
