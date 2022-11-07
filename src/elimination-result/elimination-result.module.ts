import { Module } from '@nestjs/common';
import { EliminationResultService } from './elimination-result.service';
import { EliminationResultController } from './elimination-result.controller';
import { ProgramModule } from 'src/program/program.module';

@Module({
  imports:[ProgramModule],
  controllers: [EliminationResultController],
  providers: [EliminationResultService]
})
export class EliminationResultModule {}
