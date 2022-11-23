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


@Controller('public/media')
export class PublicMediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Get('')
  findAll() {
    return this.mediaService.findAll();
  }

  @Get('gallery')
  findAllGallery() {
    return this.mediaService.findAllGallery();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Get('gallery/:id')
  findOneImage(@Param('id') id: string) {
    return this.mediaService.findOneImage(+id);
  }
}
