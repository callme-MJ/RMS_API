import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/login/interfaces/user-roles.enum';
import { Roles } from 'src/login/user/decorators/roles.decorators';
import { RolesGuard } from 'src/login/user/guards/roles.guard';
import { CreateProgramDto } from '../dto/create-program.dto';
import { CreateScheduleDto } from '../dto/create-schedule.dto';
import { UpdateProgramDto } from '../dto/update-program.dto';
import { IProgramFilter, ProgramsService } from '../program.service';

@Controller('user/programs')
export class UserProgramsController {
    constructor(private readonly programsService: ProgramsService) { }

    @Post()
    create(@Body() createProgramDto: CreateProgramDto) {
      return this.programsService.create(createProgramDto);
    }

    @Post('schedule/:id')
    async addSchedule(@Param("id")id:number,@Body() createScheduleDto: CreateScheduleDto) {
        return await this.programsService.addSchedule(id,createScheduleDto);
    }
  
    @Get()
    async findAll(@Query() queryParams: IProgramFilter) {
      try {
        return this.programsService.findAll(queryParams);
      } catch (error) {
        throw error;
      }
    }
  
    @Get(':id')
    findOne(@Param('id') id: number) {
      return this.programsService.findOne(+id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProgramDto: UpdateProgramDto) {
      return this.programsService.update(+id, updateProgramDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.programsService.remove(+id);
    }
}
