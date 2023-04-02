import {
  Body,
  Controller,
  Get,
  Param, Query
} from '@nestjs/common';
import { IProgramFilter, ProgramsService } from '../program.service';
  
  @Controller('public/programs')
  export class PublicProgramsController {
    constructor(private readonly programsService: ProgramsService) { }
  
    @Get('schedule')
    async findAll(@Query() queryParams: IProgramFilter) {
      try {
        return this.programsService.findAllSchedule(queryParams);
      } catch (error) {
        throw error;
      }
    }

    @Get('schedule/:id')
    findOne(@Param('id') id: number) {
      return this.programsService.findOneSchedule(+id);
    }

    @Get('live')
    findLivePg(@Body()time: string){
      return this.programsService.findLivePg(time);
    }
  }
  