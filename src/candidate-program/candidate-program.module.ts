import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateModule } from 'src/candidate/candidate.module';
import { ProgramsModule } from 'src/programs/programs.module';
import { CandidateProgramController } from './admin-candidate-program.controller';
import { CandidateProgramService } from './candidate-program.service';
import { CandidateProgram } from './entities/candidate-program.entity';

@Module({
  imports: [
    CandidateModule,
    ProgramsModule,
    TypeOrmModule.forFeature([CandidateProgram]),
  ],
  controllers: [CandidateProgramController],
  providers: [CandidateProgramService],
})
export class CandidateProgramModule {}
