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
    const candidate = await this.eliminationResultService.findInstitutes(sessionID);
    return candidate;
  }



}
