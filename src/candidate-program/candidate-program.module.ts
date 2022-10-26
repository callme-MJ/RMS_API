import { Module } from '@nestjs/common';
import { CandidateProgramService } from './candidate-program.service';
import { CandidateProgramController } from './admin-candidate-program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateProgram } from './entities/candidate-program.entity';
import { CandidateModule } from 'src/candidate/candidate.module';
import { ProgramsModule } from 'src/programs/programs.module';

@Module({
  imports: [CandidateModule,ProgramsModule, TypeOrmModule.forFeature([CandidateProgram])],
  controllers: [CandidateProgramController],
  providers: [CandidateProgramService]
})
export class CandidateProgramModule {}
