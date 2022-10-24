import {
  Body,
  Controller,
  Delete,
  Get, Param,
  ParseIntPipe, Patch, Post, UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCoordinatorDto } from '../dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from '../dto/update-coordinator.dto';
import { CoordinatorService } from '../services/coordinator.service';

@UseGuards(AuthGuard('jwt-admin'))
@Controller('admin/coordinator')
export class AdminCoordinatorController {
  constructor(
    private readonly coordinatorService: CoordinatorService
    ) { }
    
    @Post()
    @UseInterceptors(FileInterceptor('photo'))
    async createCandidate(
      @Body() payload: CreateCoordinatorDto,
      @UploadedFile() photo: Express.Multer.File,
    ) {
      return await this.coordinatorService.createCandidate(payload, photo);
    }

  @Get()
  findAll() {
    return this.coordinatorService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coordinatorService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCordinDto: UpdateCoordinatorDto,
    @UploadedFile() photo: Express.Multer.File,) {
    return this.coordinatorService.updateCoordinator(id, updateCordinDto);
  }
  @Delete(':id')
    async remove(@Param('id') id: string) {
      return this.coordinatorService.remove(+id);
    }
}
