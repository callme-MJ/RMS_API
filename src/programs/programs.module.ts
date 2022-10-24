import { Module } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { AdminProgramsController } from './admin-programs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Program,Category])
  ],
  controllers: [AdminProgramsController],
  providers: [ProgramsService,CategoryService]
})
export class ProgramsModule {}
