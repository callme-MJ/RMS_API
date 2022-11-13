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
import { MediaService } from '../media.service';
import { CreateNewsDTO } from '../dto/create-news.dto';
import { UpdateNewsDTO } from '../dto/update-media.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('public/media')
export class PublicMediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('/news')
  findAll() {
    return this.mediaService.findAll();
  }

  @Get('/news/:id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }
}
