import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateProgramModule } from 'src/candidate-program/candidate-program.module';
import { CandidateProgram } from 'src/candidate-program/entities/candidate-program.entity';
import { CandidateModule } from 'src/candidate/candidate.module';
import { CategoryModule } from 'src/category/category.module';
import { EliminationResultModule } from 'src/elimination-result/elimination-result.module';
import { InstituteModule } from 'src/institute/institute.module';
import { ProgramModule } from 'src/program/program.module';
import { AdminFinalResultController } from './controllers/admin-Final-result.controller';
import { ControllerFinalResultController } from './controllers/controller-Final-result.controller';
import { PublicFinalResultController } from './controllers/public-Final-result.controller';
import { FinalResult } from './entities/Final-result.entity';
import { FinalResultService } from './Final-result.service';

@Module({
  imports: [CandidateModule, ProgramModule,InstituteModule, CandidateProgramModule,CategoryModule,
    TypeOrmModule.forFeature([FinalResult,CandidateProgram]),
  ],
  controllers: [AdminFinalResultController,PublicFinalResultController,ControllerFinalResultController],
  providers: [FinalResultService]
})
export class FinalResultModule {}
