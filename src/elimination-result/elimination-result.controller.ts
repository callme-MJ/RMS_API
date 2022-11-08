import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { EliminationResultService } from './elimination-result.service';
import { CreateEliminationResultDto } from './dto/create-elimination-result.dto';
import { UpdateEliminationResultDto } from './dto/update-elimination-result.dto';

@Controller('elimination-result')
export class EliminationResultController {
  constructor(private readonly eliminationResultService: EliminationResultService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createEliminationResultDto: CreateEliminationResultDto) {
    return this.eliminationResultService.create(createEliminationResultDto);
  }

  @Post('selection')
  @UsePipes(ValidationPipe)
  updateSelection(@Body()result:boolean,@Param('id')id:number) {
    return this.eliminationResultService.updateSelection(id,result);
  }

  @Get()
  findAll() {
    return this.eliminationResultService.findAllEliminationProgram();
  }

  @Get('candidate')
  findOne(@Param('code') code: string) {
    return this.eliminationResultService.findCandidatesOfProgram(code);
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
