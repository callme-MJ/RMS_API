import { Controller, Get, Post, Body, Patch, Param, Delete, Query, SerializeOptions, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { InstituteService } from './institute.service';
import { CreateInstituteDTO } from './dto/create-institute.dto';
import { UpdateInstituteDTO } from './dto/update-institute.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt-admin'))
@Controller('admin/institutes')
export class AdminInstitutesController {
  constructor(private readonly instituteService: InstituteService) { }

  @Post()
  @UseInterceptors(FileInterceptor('coverPhoto'))
  create(
    @Body() body: CreateInstituteDTO,
    @UploadedFile() coverPhoto: Express.Multer.File
  ) {
    return this.instituteService.create(body, coverPhoto);
  }

  @SerializeOptions({ groups: ['collection'] })
  @Get()
  findAll(@Query('session_id') sessionID: number = 0) {
    return this.instituteService.findAll(+sessionID);
  }

  @SerializeOptions({ groups: ['single'] })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instituteService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('coverPhoto'))
  update(
    @Param('id') id: string,
    @Body() body: UpdateInstituteDTO,
    @UploadedFile() coverPhoto: Express.Multer.File
  ) {
    return this.instituteService.update(+id, body, coverPhoto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instituteService.remove(+id);
  }
}
