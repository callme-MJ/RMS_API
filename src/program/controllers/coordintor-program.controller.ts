import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProgramsService } from '../program.service';

@UseGuards(AuthGuard('jwt-coordinator'))
@Controller('coordinator/programs')
export class CoordinatorProgramsController {
  constructor(
    private readonly programsService: ProgramsService,
  ) { }

  @Get()
  findAll() {
    return this.programsService.findAll();
  }

}
