import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AdminCategoryController } from './controllers/admin-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { CoordinatorCategoryController } from './controllers/coordinator-category.controller';
import { CoordinatorService } from 'src/coordinator/services/coordinator.service';
import { Coordinator } from 'src/coordinator/entities/coordinator.entity';
import { CoordinatorModule } from 'src/coordinator/coordinator.module';
import { PUblicCategoryController } from './controllers/public-category.controller';
import { UserCategoryController } from './controllers/user-category.controller';

@Module({
  imports: [CoordinatorModule,
    TypeOrmModule.forFeature([Category, Coordinator])
  ],
  controllers: [AdminCategoryController, CoordinatorCategoryController,UserCategoryController,PUblicCategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule { }
