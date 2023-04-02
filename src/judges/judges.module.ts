import { Module } from '@nestjs/common';
import { JudgesService } from './judges.service';
import { JudgesController } from './controllers/judges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Judge } from './entities/judge.entity';
import { ProgramModule } from 'src/program/program.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Judge]),
    ProgramModule
  ],
  controllers: [JudgesController],
  providers: [JudgesService]
})
export class JudgesModule {}
