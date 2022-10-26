import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCandidatesController } from './controllers/admin-candidate.controller';
import { CandidateService } from './services/candidate.service';
import { Candidate } from './entities/candidate.entity';
import { S3Service } from './services/s3.service';
import { CategoryModule } from 'src/category/category.module';
import { InstituteModule } from 'src/institute/institute.module';
import { CoordinatorCandidatesController } from './controllers/coordinator-candidate.controller';
import { CoordinatorService } from 'src/coordinator/services/coordinator.service';
import { Coordinator } from 'src/coordinator/entities/coordinator.entity';
import { AdminService } from 'src/admin/admin.service';
import { Admin } from 'src/admin/entities/admin.entity';
import { ControllerCandidatesController } from './controllers/controller-candidate.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Candidate,Coordinator,Admin]),
    CategoryModule,
    InstituteModule,
  ],
  controllers: [AdminCandidatesController,CoordinatorCandidatesController,ControllerCandidatesController],
  providers: [CandidateService, S3Service,CoordinatorService,AdminService],
})
export class CandidateModule { }
