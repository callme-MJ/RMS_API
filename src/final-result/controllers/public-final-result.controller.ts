import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { FinalResultService } from '../final-result.service';
import { CreateFinalMarkDto } from '../dto/create-final-mark.dto';
import { UpdateFinalMarkDto } from '../dto/update-final-mark.dto';
import { AuthGuard } from '@nestjs/passport';
import { IProgramFilter, ProgramsService } from 'src/program/program.service';
import { CreateFinalResultDTO } from '../dto/create-final-result.dto';
import { CategoryService } from 'src/category/category.service';
import { InstituteService } from 'src/institute/institute.service';
import { SessionService } from 'src/session/session.service';

@Controller('public/final-result')
export class PublicFinalResultController {
  constructor(
    private readonly finalResultService: FinalResultService,
    private readonly programService: ProgramsService,
    private readonly categoryService: CategoryService,
    private readonly instituteService: InstituteService,
    private readonly sessionService: SessionService,
  ) {}

  @Get('/programs/published')
  async findAll(@Query() queryParams: IProgramFilter) {
    try {
      const programs = this.finalResultService.getPublishedPrograms(queryParams);
      console.log((await programs).length);
      return programs;
    } catch (error) {
      throw error;
    }
  }

  @Get('/programs')
  async findAllPrograms(@Query() queryParams: IProgramFilter) {
    try {
      const programs = this.finalResultService.getAllPrograms(queryParams);
      console.log((await programs).length);
      return programs;
    } catch (error) {
      throw error;
    }
  }

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

  @Get('/program/:code')
  getResultOfProgram(@Param('code') code: string) {
    return this.finalResultService.getResultOfProgram(code);
  }

  @Get('/institutions/published/all')
  getTotalOfInstitutionsPublished(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getTotalOfInstitutionsPublished(queryParams);
  }

  @Get('/institutions/published/category')
  getTotalOfInstitutionsByCategoryPublished(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getTotalOfInstitutionsByCategoryPublished(queryParams);
  }

  @Get('/programs/status/published')
  getProgramStutusPublished(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getProgramStutusPublished(queryParams);
  }

  @Get("/institutes/:id")
  getResultsOfInstitute(@Param('id') id: number) {
    return this.finalResultService.getResultsOfInstitute(id);
  }

  @Get('/toppers/all')
  getToppers() {
    return this.finalResultService.getToppers();
  }
  
}
