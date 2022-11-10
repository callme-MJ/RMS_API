import { Controller, Get } from '@nestjs/common';
import { EliminationResultService } from '../elimination-result.service';

@Controller('public/elimination-result')
export class EliminationResultController {
  constructor(
    private readonly eliminationResultService: EliminationResultService,
  ) {}

  @Get()
  findAll() {
    return this.eliminationResultService.findAllSelectedPrograms();
    
  }
}
