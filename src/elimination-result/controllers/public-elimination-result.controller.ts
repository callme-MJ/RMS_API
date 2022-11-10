import { Controller, Get, Param } from '@nestjs/common';
import { EliminationResultService } from '../elimination-result.service';

@Controller('public/elimination-result')
export class PublicEliminationResultController {
  constructor(
    private readonly eliminationResultService: EliminationResultService,
  ) {}

  @Get()
  findAll() {
    return this.eliminationResultService.findAllEliminationProgram();
  }

  @Get('selection/:code')
  async findSelected(@Param('code') code: string) {
    return await this.eliminationResultService.findSelected(code)
  }
}
