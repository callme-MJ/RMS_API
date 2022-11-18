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
import { CreateMediaDTO } from '../dto/create-media.dto';
import { UpdateNewsDTO } from '../dto/update-media.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/login/user/guards/roles.guard';
import { Roles } from 'src/login/user/decorators/roles.decorators';
import { Role } from 'src/login/interfaces/user-roles.enum';

@UseGuards(AuthGuard('jwt-user'), RolesGuard)
@Roles(Role.MEDIA)
@Controller('user/media')
export class UserMediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createNewsDTO: CreateMediaDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaService.create(createNewsDTO, file);
  }

  @Get()
  findAll() {
    return this.mediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDTO: UpdateNewsDTO) {
    return this.mediaService.update(+id, updateNewsDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
