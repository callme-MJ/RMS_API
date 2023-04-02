import { Controller, Get, Param, Query } from '@nestjs/common';
import { ICandidateFIilter, ICandidateProgramFIilter } from 'src/candidate-program/candidate-program.service';
import { EliminationResultService } from '../elimination-result.service';

@Controller('public/elimination-result')
export class PublicEliminationResultController {
  constructor(
    private readonly eliminationResultService: EliminationResultService,
  ) {}


  @Get("")
  findAllPublishedPrograms() {
    return this.eliminationResultService.findAllPublishedEliminationProgram();
  }

  @Get('candidates/:code')
  async findOne(@Param('code') code: string) {
    const candidate =
      await this.eliminationResultService.findCandidatesOfPublishedProgram(
        code
      );
    return candidate;
  }

  @Get('candidates/institutes/:id')
  async findSelectedOfInstitute(@Param('id') id: number) {
    const candidate =
      await this.eliminationResultService.findSelectedOfInstitute(id);
    return candidate;
  }

  @Get('institutes')
  async findInstitutes(@Query() sessionID: number) {
    const institute = await this.eliminationResultService.findInstitutes(sessionID);
    return institute;
  }

  @Get('institutes/count')
  async findInstituteCount(@Query() sessionID: number) {
    const count = await this.eliminationResultService.findInstituteCount(sessionID);
    return count;
  }

  @Get('institutes/count/:id')
  async findInstituteCountByCategory(@Param('id') id: number) {
    const count = await this.eliminationResultService.findInstituteCountByCategory(id)
    return count;
  }

  @Get('categories')
  async findCategories(@Query() sessionID: number) {
    const categories = await this.eliminationResultService.findCategories(sessionID);
    return categories;
  }



}
