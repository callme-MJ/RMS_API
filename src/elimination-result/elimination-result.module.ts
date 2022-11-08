import { Module } from '@nestjs/common';
import { EliminationResultService } from './elimination-result.service';
import { EliminationResultController } from './controllers/controller-elimination-result.controller';
import { CandidateModule } from 'src/candidate/candidate.module';
import { ProgramModule } from 'src/program/program.module';
import { CandidateProgramModule } from 'src/candidate-program/candidate-program.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EliminationResult } from './entities/elimination-result.entity';

@Module({
  imports: [CandidateModule, ProgramModule, CandidateProgramModule,
    TypeOrmModule.forFeature([EliminationResult]),
  ],
  controllers: [EliminationResultController],
  providers: [EliminationResultService]
})
export class EliminationResultModule { }
