import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateNewsDTO } from './dto/create-news.dto';
import { UpdateNewsDTO } from './dto/update-media.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('/news')
  @UseInterceptors(FileInterceptor('photo'))
  create(
    @Body() createNewsDTO: CreateNewsDTO,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.mediaService.create(createNewsDTO,photo);
  }

  @Get('/news')
  findAll() {
    return this.mediaService.findAll();
  }

  @Get('/news/:id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Patch('/news/:id')
  update(@Param('id') id: string, @Body() updateNewsDTO: UpdateNewsDTO) {
    return this.mediaService.update(+id, updateNewsDTO);
  }

  @Delete('/news/:id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
