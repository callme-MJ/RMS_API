import { Module } from '@nestjs/common';
import { EliminationResultService } from './elimination-result.service';
import { EliminationResultController } from './elimination-result.controller';

@Module({
  controllers: [EliminationResultController],
  providers: [EliminationResultService]
})
export class EliminationResultModule {}
