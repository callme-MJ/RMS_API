import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateProgramModule } from 'src/candidate-program/candidate-program.module';
import { CandidateProgram } from 'src/candidate-program/entities/candidate-program.entity';
import { CandidateModule } from 'src/candidate/candidate.module';
import { CategoryModule } from 'src/category/category.module';
import { Institute } from 'src/institute/entities/institute.entity';
import { InstituteModule } from 'src/institute/institute.module';
import { Program } from 'src/program/entities/program.entity';
import { ProgramModule } from 'src/program/program.module';
import { ControllerFinalResultController } from './controllers/controller-final-result.controller';
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
    TypeOrmModule.forFeature([FinalMark, CandidateProgram,Program,Institute]),
  ],
  controllers: [ControllerFinalResultController,PublicFinalResultController],
  providers: [FinalResultService],
})
export class FinalResultModule {}
