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
  UseGuards,
} from '@nestjs/common';
import { MediaService } from '../media.service';
import { CreateNewsDTO } from '../dto/create-news.dto';
import { UpdateNewsDTO } from '../dto/update-media.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/login/user/guards/roles.guard';
import { Roles } from 'src/login/user/decorators/roles.decorators';
import { Role } from 'src/login/interfaces/user-roles.enum';

@UseGuards(AuthGuard('jwt-user'),RolesGuard)
@Roles(Role.CONTROLLER)
@Controller('user/media')
export class UserMediaController {
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
