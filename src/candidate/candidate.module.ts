import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCandidatesController } from './controllers/admin-candidate.controller';
import { CandidateService } from './services/candidate.service';
import { Candidate } from './entities/candidate.entity';
import { S3Service } from './services/s3.service';
import { CategoryModule } from 'src/category/category.module';
import { InstituteModule } from 'src/institute/institute.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Candidate]),
    CategoryModule,
    InstituteModule
  ],
  controllers: [AdminCandidatesController],
  providers: [CandidateService, S3Service],
  exports: [CandidateService]
})
export class CandidateModule { }
