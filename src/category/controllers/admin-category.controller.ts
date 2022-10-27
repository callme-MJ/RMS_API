import { Controller, Get, Post, Body, Patch, Param, Delete, Query, SerializeOptions, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoryService } from '../category.service';
import { CreateCategoryDTO } from '../dto/create-category.dto';
import { UpdateCategoryDTO } from '../dto/update-category.dto';


@UseGuards(AuthGuard('jwt-admin'))
@Controller('admin/categories')
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  create(
    @Body() body: CreateCategoryDTO
  ) {
    return this.categoryService.create(body);
  }

  @SerializeOptions({ groups: ['collection'] })
  @Get()
  findAll(@Query('session_id') sessionID: number = 0) {
    return this.categoryService.findAll(+sessionID);
  }

  @SerializeOptions({ groups: ['single'] })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateCategoryDTO) {
    return this.categoryService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
