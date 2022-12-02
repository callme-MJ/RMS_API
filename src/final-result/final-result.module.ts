import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateProgramModule } from 'src/candidate-program/candidate-program.module';
import { CandidateProgram } from 'src/candidate-program/entities/candidate-program.entity';
import { CandidateModule } from 'src/candidate/candidate.module';
import { CategoryModule } from 'src/category/category.module';
import { InstituteModule } from 'src/institute/institute.module';
import { Program } from 'src/program/entities/program.entity';
import { ProgramModule } from 'src/program/program.module';
import { ControllerFinalResultController } from './controllers/controller-final-result.controller';
import { MediaFinalResultController } from './controllers/media-final-result.controller';
import { PublicFinalResultController } from './controllers/public-final-result.controller';
import { FinalMark } from './entities/final-mark.entity';
import { FinalResultService } from './final-result.service';

@Module({
  imports: [
    ProgramModule,
    CandidateProgramModule,
    CandidateModule,
    ProgramModule,
    CategoryModule,
    InstituteModule,
    TypeOrmModule.forFeature([FinalMark, CandidateProgram,Program]),
  ],
  controllers: [ControllerFinalResultController,PublicFinalResultController,MediaFinalResultController],
  providers: [FinalResultService],
})
export class FinalResultModule {}
