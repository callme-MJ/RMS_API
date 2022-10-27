import { Controller, Get, Post, Body, Patch, Param, Delete, Query, SerializeOptions, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoryService } from '../category.service';
import { CreateCategoryDTO } from '../dto/create-category.dto';
import { UpdateCategoryDTO } from '../dto/update-category.dto';

@UseGuards(AuthGuard('jwt-coordinator'))
@Controller('coordinator/categories')
export class CoordinatorCategoryController {
  constructor(private readonly categoryService: CategoryService) { }



  @SerializeOptions({ groups: ['collection'] })
  @Get()
  findAll(@Request()req: any) {
    return this.categoryService.findAllForCoordinator(req.user.id);
  }

  @SerializeOptions({ groups: ['single'] })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }
}
