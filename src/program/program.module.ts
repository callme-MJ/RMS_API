import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { SessionModule } from 'src/session/session.module';
import { AdminProgramsController } from './admin-program.controller';
import { Program } from './entities/program.entity';
import { ProgramsService } from './program.service';

@Module({
  imports: [CategoryModule, SessionModule, TypeOrmModule.forFeature([Program])],
  controllers: [AdminProgramsController],
  providers: [ProgramsService],
  exports:[ProgramsService]
})
export class ProgramModule {}
