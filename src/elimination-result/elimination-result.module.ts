import { Module } from '@nestjs/common';
import { EliminationResultService } from './elimination-result.service';
import { EliminationResultController } from './elimination-result.controller';
import { ProgramModule } from 'src/program/program.module';
import { CandidateProgramModule } from 'src/candidate-program/candidate-program.module';

@Module({
  imports:[ProgramModule,CandidateProgramModule],
  controllers: [EliminationResultController],
  providers: [EliminationResultService]
})
export class EliminationResultModule {}
