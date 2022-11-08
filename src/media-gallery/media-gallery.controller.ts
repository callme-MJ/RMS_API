import { Controller, Get, Post, Body, Patch, Param, Delete, Query, SerializeOptions, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { MediaGalleryService } from './media-gallery.service';
import { CreateMediaGalleryDto } from './dto/create-media-gallery.dto';
import { UpdateMediaGalleryDto } from './dto/update-media-gallery.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

// @UseGuards(AuthGuard('jwt-user'))
@Controller('user/gallery')
export class MediaGalleryController {
  constructor(private readonly mediaGalleryService: MediaGalleryService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() body: CreateMediaGalleryDto,
    @UploadedFile() image:Express.Multer.File
  ) {
    return this.mediaGalleryService.create(body, image);
  }

  @SerializeOptions({ groups: ['collection'] })
  @Get()
  findAll(@Query('session_id') sessionID: number = 0) {
    return this.mediaGalleryService.findAll(+sessionID);
  }

  @SerializeOptions({ groups: ['single'] })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaGalleryService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() body: UpdateMediaGalleryDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.mediaGalleryService.update(+id, body, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaGalleryService.remove(+id);
  }
}
