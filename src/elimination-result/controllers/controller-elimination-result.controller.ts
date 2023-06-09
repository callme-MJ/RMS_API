import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { EliminationResultService } from '../elimination-result.service';
import { CreateEliminationResultDto } from '../dto/create-elimination-result.dto';
import { UpdateEliminationResultDto } from '../dto/update-elimination-result.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('user/elimination-result')
@UseGuards(AuthGuard('jwt-user'))
export class ControllerEliminationResultController {
  constructor(private readonly eliminationResultService: EliminationResultService) { }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createEliminationResultDto: CreateEliminationResultDto) {
    return this.eliminationResultService.create(createEliminationResultDto);
  }

  @Post('/selection/:id')
  @UsePipes(ValidationPipe)
  updateSelection(@Param('id') id: number) {
    return this.eliminationResultService.updateSelection(id);
  }

  @Delete('/selection/:id')
  @UsePipes(ValidationPipe)
  deleteSelection(@Param('id') id: number) {
    return this.eliminationResultService.deleteSelection(id);
  }

  @Get('selection/:code')
  async findSelected(@Param('code') code: string) {
    return await this.eliminationResultService.findSelected(code)
  }

  @Get()
  findAll() {
    return this.eliminationResultService.findAllEliminationProgram();
  }

  @Get('candidates/:code')
  async findOne(@Param('code') code: string) {
    const candidate = await this.eliminationResultService.findCandidatesOfProgram(code);
    return candidate
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEliminationResultDto: UpdateEliminationResultDto) {
    return this.eliminationResultService.update(+id, updateEliminationResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eliminationResultService.remove(+id);
  }

  @Post('/publish/:code')
  async publish(@Param('code') code: string) {
    return await this.eliminationResultService.publishResult(code)
  }

  @Delete('/publish/:code')
  async unpublish(@Param('code') code: string) {
    return await this.eliminationResultService.unpublishResult(code)
  }

  @Get('points')
  async findPoints(@Body() body: any) {
    return await this.eliminationResultService.findPoints(body.chestNO, body.programCode)
  }

  @Get('points/:code')
  async findPointsByProgramCode(@Param("code") code: any) {
    return await this.eliminationResultService.findPointsByProgramCode(code)
  }

  
  


  


}
