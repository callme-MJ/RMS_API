import { Module } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { AdminProgramsController } from './admin-programs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { CategoryModule } from 'src/category/category.module';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [CategoryModule,SessionModule,
    TypeOrmModule.forFeature([Program])
  ],
  controllers: [AdminProgramsController],
  providers: [ProgramsService]
})
export class ProgramsModule {}
