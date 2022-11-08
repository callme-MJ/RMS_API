import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateModule } from 'src/candidate/candidate.module';
import { ProgramModule } from 'src/program/program.module';
import { AdminCandidateProgramController } from './controllers/admin-candidate-program.controller';
import { CandidateProgramService } from './candidate-program.service';
import { CandidateProgram } from './entities/candidate-program.entity';
import { CoordinatorCandidateProgramController } from './controllers/coordinator-candidate-program.controller';
import { CoordinatorModule } from 'src/coordinator/coordinator.module';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { ControllerCandidateProgramController } from './controllers/controller-candidate-program.controller';

@Module({
  imports: [
    CandidateModule,
    ProgramModule,
    CoordinatorModule,
    TypeOrmModule.forFeature([CandidateProgram,Candidate]),
  ],
  controllers: [AdminCandidateProgramController, CoordinatorCandidateProgramController,ControllerCandidateProgramController],
  providers: [CandidateProgramService],
  exports: [CandidateProgramService]
})
export class CandidateProgramModule { }
