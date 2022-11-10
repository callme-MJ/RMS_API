import { Controller, Get } from '@nestjs/common';
import { EliminationResultService } from '../elimination-result.service';

@Controller('public/elimination-result')
export class AdminEliminationResultController {
  constructor(
    private readonly eliminationResultService: EliminationResultService,
  ) {}

  @Get()
  findAll() {
    return this.eliminationResultService.findAllSelectedPrograms();
    
  }
}
