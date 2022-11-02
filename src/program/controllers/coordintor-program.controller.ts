import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProgramsService } from '../program.service';

@UseGuards(AuthGuard('jwt-coordinator'))
@Controller('coordinator/programs')
export class CoordinatorProgramsController {
  constructor(
    private readonly programsService: ProgramsService,
  ) { }

  @Get()
  findAll(@Request() req: any) {
    console.log(req.user.id);
    return this.programsService.findAllForCoordinator(req.user.id);
  }

  

}
