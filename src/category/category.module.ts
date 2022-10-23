import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AdminCategoryController } from './admin-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Category ])
  ],
  controllers: [AdminCategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
