import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AdminCategoryController } from './admin-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { CoordinatorCategoryController } from './coordinator-category';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Category ])
  ],
  controllers: [AdminCategoryController,CoordinatorCategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
