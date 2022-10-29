import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { CoordinatorModule } from 'src/coordinator/coordinator.module';
import { SessionModule } from 'src/session/session.module';
import { AdminProgramsController } from './controllers/admin-program.controller';
import { CoordinatorProgramsController } from './controllers/coordintor-program.controller';
import { Program } from './entities/program.entity';
import { ProgramsService } from './program.service';


@Module({
  imports: [CategoryModule, SessionModule,CoordinatorModule, TypeOrmModule.forFeature([Program])],
  controllers: [AdminProgramsController,CoordinatorProgramsController],
  providers: [ProgramsService],
  exports: [ProgramsService]
})
export class ProgramModule { }
