import { Controller, Get, Param, Query } from '@nestjs/common';
import { ICandidateFIilter, ICandidateProgramFIilter } from 'src/candidate-program/candidate-program.service';
import { FinalResultService } from '../Final-result.service';

@Controller('public/Final-result')
export class PublicFinalResultController {
  constructor(
    private readonly FinalResultService: FinalResultService,
  ) {}


  @Get("")
  findAllPublishedPrograms() {
    return this.FinalResultService.findAllPublishedFinalProgram();
  }

  @Get('candidates/:code')
  async findOne(@Param('code') code: string) {
    const candidate =
      await this.FinalResultService.findCandidatesOfPublishedProgram(
        code
      );
    return candidate;
  }

  @Get('candidates/institutes/:id')
  async findSelectedOfInstitute(@Param('id') id: number) {
    const candidate =
      await this.FinalResultService.findSelectedOfInstitute(id);
    return candidate;
  }

  @Get('institutes')
  async findInstitutes(@Query() sessionID: number) {
    const institute = await this.FinalResultService.findInstitutes(sessionID);
    return institute;
  }

  @Get('institutes/count')
  async findInstituteCount(@Query() sessionID: number) {
    const count = await this.FinalResultService.findInstituteCount(sessionID);
    return count;
  }

  @Get('institutes/count/:id')
  async findInstituteCountByCategory(@Param('id') id: number) {
    const count = await this.FinalResultService.findInstituteCountByCategory(id)
    return count;
  }

  @Get('categories')
  async findCategories(@Query() sessionID: number) {
    const categories = await this.FinalResultService.findCategories(sessionID);
    return categories;
  }



}
