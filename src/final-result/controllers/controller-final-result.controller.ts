import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { CreateFinalResultDTO } from '../DTO/create-Final-result.DTO';
import { UpdateFinalResultDTO } from '../DTO/update-Final-result.DTO';
import { AuthGuard } from '@nestjs/passport';
import { FinalResultService } from '../Final-result.service';
import { IProgramFilter } from 'src/program/program.service';


@Controller('user/Final-result')
@UseGuards(AuthGuard('jwt-user'))
export class ControllerFinalResultController {
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

  @Delete('/selection/:id')
  @UsePipes(ValidationPipe)
  deleteSelection(@Param('id') id: number) {
    return this.FinalResultService.deleteSelection(id);
  }

  @Get('selection/:code')
  async findSelected(@Param('code') code: string) {
    return await this.FinalResultService.findSelected(code)
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinalResultDTO: UpdateFinalResultDTO) {
    return this.FinalResultService.update(+id, updateFinalResultDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.FinalResultService.remove(+id);
  }

  @Post('/publish/:code')
  async publish(@Param('code') code: string) {
    return await this.FinalResultService.publishResult(code)
  }

  @Delete('/publish/:code')
  async unpublish(@Param('code') code: string) {
    return await this.FinalResultService.unpublishResult(code)
  }

  @Get('points')
  async findPoints(@Body() body: any) {
    return await this.FinalResultService.findPoints(body.chestNO, body.programCode)
  }

  @Get('points/:code')
  async findPointsByProgramCode(@Param("code") code: any) {
    return await this.FinalResultService.findPointsByProgramCode(code)
  }

  
  


  


}
