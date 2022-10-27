import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from 'src/admin/admin.module';
import { AdminService } from 'src/admin/admin.service';
import { Admin } from 'src/admin/entities/admin.entity';
import { CandidateModule } from 'src/candidate/candidate.module';
import { S3Service } from 'src/candidate/services/s3.service';
import { Institute } from 'src/institute/entities/institute.entity';
import { InstituteModule } from 'src/institute/institute.module';
import { InstituteService } from 'src/institute/institute.service';
import { AdminCoordinatorController } from './controllers/admin-coordinator.controller';
import { Coordinator } from './entities/coordinator.entity';
import { CoordinatorService } from './services/coordinator.service';

@Module({
  imports:[TypeOrmModule.forFeature([Coordinator,Institute,Admin]),CandidateModule,InstituteModule,AdminModule],
  controllers: [AdminCoordinatorController],
  providers: [CoordinatorService,S3Service,InstituteService,AdminService],
  exports:[CoordinatorService]
})
export class CoordinatorModule {}
