import { Module } from '@nestjs/common';
import { EliminationResultService } from './elimination-result.service';
import { ControllerEliminationResultController } from './controllers/controller-elimination-result.controller';
import { CandidateModule } from 'src/candidate/candidate.module';
import { ProgramModule } from 'src/program/program.module';
import { CandidateProgramModule } from 'src/candidate-program/candidate-program.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EliminationResult } from './entities/elimination-result.entity';
import { AdminEliminationResultController } from './controllers/admin-elimination-result.controller';
import { CandidateProgram } from 'src/candidate-program/entities/candidate-program.entity';

@Module({
  imports: [CandidateModule, ProgramModule, CandidateProgramModule,
    TypeOrmModule.forFeature([EliminationResult,CandidateProgram]),
  ],
  controllers: [ControllerEliminationResultController,AdminEliminationResultController],
  providers: [EliminationResultService]
})
export class EliminationResultModule { }
