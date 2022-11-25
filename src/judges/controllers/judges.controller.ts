import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { JudgesService } from '../judges.service';
import { CreateJudgeDto } from '../dto/create-judge.dto';
import { UpdateJudgeDto } from '../dto/update-judge.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/login/user/decorators/roles.decorators';
import { Role } from 'src/login/interfaces/user-roles.enum';
import { RolesGuard } from 'src/login/user/guards/roles.guard';

// @UseGuards(AuthGuard('jwt-user'), RolesGuard)
// @Roles(Role.VOLUNTEER)
@Controller('user/judges')
export class JudgesController {
  constructor(private readonly judgesService: JudgesService) {}

  @Post()
  create(@Body() createJudgeDto: CreateJudgeDto) {
    return this.judgesService.create(createJudgeDto);
  }

  @Post('program/:code')
  addProgram(@Param('id')id:number,@Query('code')code:string) {
    return this.judgesService.addProgram(code,id);
  }


  @Get()
  findAll() {
    return this.judgesService.findAll();
  }
  @Get('/programs')
 async findAllPrograms() {
    return await this.judgesService.findAllPrograms();
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
