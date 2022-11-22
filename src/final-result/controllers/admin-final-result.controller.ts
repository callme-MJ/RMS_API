import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IProgramFilter } from 'src/program/program.service';
import { CreateFinalResultDTO } from '../dto/create-Final-result.dto';
import { UpdateFinalResultDTO } from '../dto/update-Final-result.dto';
import { FinalResultService } from '../Final-result.service';

@Controller('admin/Final-result')
@UseGuards(AuthGuard('jwt-admin'))
export class AdminFinalResultController {
  constructor(private readonly FinalResultService: FinalResultService) { }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createFinalResultDTO: CreateFinalResultDTO) {
    return this.FinalResultService.create(createFinalResultDTO);
  }

  @Post('/selection/:id')
  @UsePipes(ValidationPipe)
  updateSelection(@Param('id') id: number) {
    return this.FinalResultService.updateSelection(id);
  }

  @Get()
  findAll(@Query() queryParams: IProgramFilter) {
    return this.FinalResultService.findAll(queryParams);
  }

  @Get('candidates/:code')
  async findOne(@Param('code') code: string) {
    const candidate = await this.FinalResultService.findCandidatesOfProgram(code);
    return candidate
  }
  @Get('selection/:code')
  async findSelected(@Param('code') code: string) {
    return await this.FinalResultService.findSelected(code)
  }

  @Get('points')
  async findPoints(@Body() body: any) {
    return await this.FinalResultService.findPoints(body.chestNO, body.programCode)
  }

  @Get('points/:code')
  async findPointsByProgramCode(@Body() body: any) {
    return await this.FinalResultService.findPointsByProgramCode(body.programCode)
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinalResultDTO: UpdateFinalResultDTO) {
    return this.FinalResultService.update(+id, updateFinalResultDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.FinalResultService.remove(+id);
  }
}
