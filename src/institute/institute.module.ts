import { Module } from '@nestjs/common';
import { InstituteService } from './institute.service';
import { AdminInstitutesController } from './admin-institutes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Institute } from './entities/institute.entity';
import { S3Service } from 'src/candidate/services/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Institute])
  ],
  controllers: [AdminInstitutesController],
  providers: [InstituteService, S3Service, ],
  exports: [InstituteService]
})
export class InstituteModule { }
