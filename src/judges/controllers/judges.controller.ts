import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JudgesService } from '../judges.service';
import { CreateJudgeDto } from '../dto/create-judge.dto';
import { UpdateJudgeDto } from '../dto/update-judge.dto';

@Controller('user/judges')
export class JudgesController {
  constructor(private readonly judgesService: JudgesService) {}

  @Post()
  create(@Body() createJudgeDto: CreateJudgeDto) {
    return this.judgesService.create(createJudgeDto);
  }

  @Get()
  findAll() {
    return this.judgesService.findAll();
  }
  @Get()
  findAllPrograms() {
    return this.judgesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.judgesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJudgeDto: UpdateJudgeDto) {
    return this.judgesService.update(+id, updateJudgeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.judgesService.remove(+id);
  }
}
