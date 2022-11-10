import { Controller, Get, Param, Query, SerializeOptions } from '@nestjs/common';
import { CategoryService } from '../category.service';

@Controller('public/categories')
export class PUblicCategoryController {
  constructor(private readonly categoryService: CategoryService) { }



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
}
