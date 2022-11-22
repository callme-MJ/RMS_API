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
import { CreateMediaDTO } from '../dto/create-media.dto';
import { UpdateNewsDTO } from '../dto/update-media.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('public/media')
export class PublicMediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Get('')
  findAll() {
    return this.mediaService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }
}
