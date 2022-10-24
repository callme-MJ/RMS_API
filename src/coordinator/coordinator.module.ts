import { Module } from '@nestjs/common';
import { CoordinatorService } from './services/coordinator.service';
import { AdminCoordinatorController } from './controllers/admin-coordinator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { Coordinator } from './entities/coordinator.entity';
import { CandidateModule } from 'src/candidate/candidate.module';
import { S3Service } from 'src/candidate/services/s3.service';
import { InstituteModule } from 'src/institute/institute.module';
import { InstituteService } from 'src/institute/institute.service';

@Module({
  imports:[TypeOrmModule.forFeature([Coordinator]),CandidateModule,InstituteModule],
  controllers: [AdminCoordinatorController],
  providers: [CoordinatorService,S3Service,InstituteService],
  exports:[CoordinatorService]
})
export class CoordinatorModule {}
