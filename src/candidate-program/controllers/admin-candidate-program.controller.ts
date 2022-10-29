import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ICandidateFilter } from 'src/candidate/services/candidate.service';
import { CandidateProgramService, ICandidateProgramFIilter } from '../candidate-program.service';
import { CreateCandidateProgramDTO } from '../dto/create-candidate-program.dto';
import { UpdateCandidateProgramDTO } from '../dto/update-candidate-program.dto';

@UseGuards(AuthGuard('jwt-admin'))
@Controller('admin/candidate-programs')
export class AdminCandidateProgramController {
  constructor(
    private readonly candidateProgramService: CandidateProgramService,
  ) { }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createCandidateProgramDto: CreateCandidateProgramDTO) {
    return this.candidateProgramService.create(createCandidateProgramDto);
  }

  @Get()
  findAll(@Query() queryParams: ICandidateProgramFIilter) {
    return this.candidateProgramService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.candidateProgramService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCandidateProgramDto: UpdateCandidateProgramDTO,
  ) {
    return this.candidateProgramService.update(+id, updateCandidateProgramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.candidateProgramService.remove(+id);
  }
}