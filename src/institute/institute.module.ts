import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { instituteController } from './controllers/institute.controller';
import { instituteService } from './services/institute.service';
import { Candidate } from './entities/candidate.entity';
import { Institute } from './entities/institute.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Candidate, Institute])],
  controllers: [instituteController],
  providers: [instituteService]
})
export class instituteModule {}
