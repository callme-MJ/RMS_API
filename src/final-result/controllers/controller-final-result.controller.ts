import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoryService } from 'src/category/category.service';
import { InstituteService } from 'src/institute/institute.service';
import { IProgramFilter, ProgramsService } from 'src/program/program.service';
import { SessionService } from 'src/session/session.service';
import { CreateFinalMarkDto } from '../dto/create-final-mark.dto';
import { CreateFinalResultDTO } from '../dto/create-final-result.dto';
import { FinalResultService } from '../final-result.service';

@Controller('user/final-result')
@UseGuards(AuthGuard('jwt-user'))
export class ControllerFinalResultController {
  constructor(
    private readonly finalResultService: FinalResultService,
    private readonly programService: ProgramsService,
    private readonly categoryService: CategoryService,
    private readonly instituteService: InstituteService,
    private readonly sessionService: SessionService,
  ) {}
  @Get('categories')
  async findCategories(@Query() query: any) {
    const categories = await this.categoryService.findAll(query.sessionID);
    return categories;
  }

  @Get('institutes')
  async findInstitutes(@Query() query: any) {
    const institute = await this.instituteService.findAll(query.sessionID);
    return institute;
  }

  @Get('sessions')
  async findSessions() {
    const institute = await this.sessionService.getAllSessions();
    return institute;
  }

  @Get('/programs')
  async findAll(@Query() queryParams: IProgramFilter) {
    try {
      const programs = this.programService.findAll(queryParams);
      // console.log((await programs).length)
      return programs;
    } catch (error) {
      throw error;
    }
  }

  @Get('candidates/:code')
  async findOne(@Param('code') code: string) {
    const candidate = await this.finalResultService.findCandidatesOfProgram(
      code,
    );
    return candidate;
  }

  @Post('/marks')
  @UsePipes(ValidationPipe)
  create(@Body() createEliminationMarkDto: CreateFinalMarkDto) {
    return this.finalResultService.entryMarks(createEliminationMarkDto);
  }

  @Get('/marks/all')
  findAllMarks() {
    return this.finalResultService.findAllMarks();
  }

  @Get('/marks/programs/:code')
  findAllMarksOfProgram(@Param('code') code: string) {
    return this.finalResultService.findAllMarksOfProgram(code);
  }

  @Post('/:id')
  @UsePipes(ValidationPipe)
  createResult(
    @Body() CreateFinalResultDTO: CreateFinalResultDTO,
    @Param('id') id: number,
  ) {
    return this.finalResultService.createResult(CreateFinalResultDTO, id);
  }

  @Get('/:id')
  getResult(@Param('id') id: number) {
    return this.finalResultService.getResult(id);
  }

  @Get('/program/:code')
  getResultOfProgram(@Param('code') code: string) {
    return this.finalResultService.getResultOfProgram(code);
  }

  @Get('/institutions/all')
  getTotalOfInstitutions(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getTotalOfInstitutions(queryParams);
  }

  @Get('/institutions/category/:id')
  getTotalOfInstitutionsByCategory(@Param('id') id: number) {
    return this.finalResultService.getTotalOfInstitutionsByCategory(id);
  }

  @Get('/programs/status')
  getProgramsStutus(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getProgramsStutus();
  }

  @Get('/toppers/all')
  getToppers() {
    return this.finalResultService.getToppers();
  }

  @Post('/publish/:code')
  publishResult(@Param('code') code: string) {
    return this.finalResultService.publishResultOfFinal(code);
  }

  @Delete('/publish/:code')
  unPublishResult(@Param('code') code: string) {
    return this.finalResultService.unPublishResultOfFinal(code);
  }

  @Get("programs/published")
  getPublishedPrograms(){
    return this.finalResultService.getPublishedPrograms()
  }

}
