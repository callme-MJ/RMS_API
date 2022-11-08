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

  @Get()
  findAll() {
    return this.eliminationResultService.findAllEliminationProgram();
  }

  @Get('candidates/:code')
  async findOne(@Param('code') code: string) {
    const candidate = await this.eliminationResultService.findCandidatesOfProgram(code);
    return candidate
  }

  @Get('selection/:code')
  async findSelected(@Param('code')code:string){
    return await this.eliminationResultService.findSelected(code)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEliminationResultDto: UpdateEliminationResultDto) {
    return this.eliminationResultService.update(+id, updateEliminationResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eliminationResultService.remove(+id);
  }
}
