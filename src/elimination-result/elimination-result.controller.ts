import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EliminationResultService } from './elimination-result.service';
import { CreateEliminationResultDto } from './dto/create-elimination-result.dto';
import { UpdateEliminationResultDto } from './dto/update-elimination-result.dto';

@Controller('elimination-result')
export class EliminationResultController {
  constructor(private readonly eliminationResultService: EliminationResultService) {}

  @Post()
  create(@Body() createEliminationResultDto: CreateEliminationResultDto) {
    return this.eliminationResultService.create(createEliminationResultDto);
  }

  @Get()
  findAll() {
    return this.eliminationResultService.findAllEliminationProgram();
  }

  @Get('candidate/:code')
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
}
