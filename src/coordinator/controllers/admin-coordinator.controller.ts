import {
  Body,
  Controller,
  Delete,
  Get, Param,
  ParseIntPipe, Patch, Post, Query, UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCoordinatorDto } from '../dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from '../dto/update-coordinator.dto';
import { CoordinatorService, ICoordinatorFilter } from '../services/coordinator.service';

// @UseGuards(AuthGuard('jwt-admin'))
@Controller('admin/coordinator')
export class AdminCoordinatorController {
  constructor(
    private readonly coordinatorService: CoordinatorService
    ) { }
    
    @Post()
    @UseInterceptors(FileInterceptor('photo'))
    async createCoordinator(
      @Body() payload: CreateCoordinatorDto,
      @UploadedFile() photo: Express.Multer.File,
    ) {
      return await this.coordinatorService.createCoordinator(payload, photo);
    }

  @Get()
  async findAll(@Query() queryParams:ICoordinatorFilter) {
    try
    {return await this.coordinatorService.findAll(queryParams);}
    catch (error){
      throw error
    }
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coordinatorService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateCoordinatorDto,
    @UploadedFile() photo: Express.Multer.File,) {
    return this.coordinatorService.updateCoordinator(+id, updateData,photo);
  }
  @Delete(':id')
    async remove(@Param('id') id: string) {
      return this.coordinatorService.remove(+id);
    }
}
