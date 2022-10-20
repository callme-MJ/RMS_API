import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstituteController } from './controllers/institute.controller';
import { InstituteService } from './services/institute.service';
import { Candidate } from './entities/candidate.entity';
import { Institute } from './entities/institute.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Candidate, Institute])],
  controllers: [InstituteController],
  providers: [InstituteService]
})
export class InstituteModule {}
