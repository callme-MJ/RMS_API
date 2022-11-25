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

  @Post('/marks/one')
  @UsePipes(ValidationPipe)
  create(@Body() createEliminationMarkDto: CreateFinalMarkDto) {
    return this.finalResultService.entryMarks(createEliminationMarkDto);
  }

  @Delete('/marks/one/:id')
  DeleteMarks(@Param('id') id: number) {
    return this.finalResultService.DeleteMarks(id);
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

  @Delete('/:id')
  deleteResult(
    @Param('id') id: number,
  ) {
    return this.finalResultService.deleteResult(id);
  }

  @Get('/:id')
  getResult(@Param('id') id: number) {
    return this.finalResultService.getResult(id);
  }

  @Get('/program/:code')
  getResultOfProgram(@Param('code') code: string) {
    return this.finalResultService.getResultOfProgram(code);
  }

  @Get('/institutions/published/all')
  getTotalOfInstitutionsPublished(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getTotalOfInstitutionsPublished(queryParams);
  }

  @Get('/institutions/entered/all')
  getTotalOfInstitutionsEntered(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getTotalOfInstitutionsEntered(queryParams);
  }

  @Get('/institutions/category/published/:id')
  getTotalOfInstitutionsByCategoryPublished(@Param('id') id: number) {
    return this.finalResultService.getTotalOfInstitutionsByCategoryPublished(id);
  }

  @Get('/institutions/category/entered/:id')
  getTotalOfInstitutionsByCategoryEntered(@Param('id') id: number) {
    return this.finalResultService.getTotalOfInstitutionsByCategoryEntered(id);
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
