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
  async findOne(@Param('code') code: string,@Query()queryParams: ICandidateProgramFIilter,) {
    const candidate =
      await this.eliminationResultService.findCandidatesOfPublishedProgram(
        code,queryParams
      );
    return candidate;
  }
}
