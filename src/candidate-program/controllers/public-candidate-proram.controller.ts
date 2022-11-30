import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CandidateProgramService } from '../candidate-program.service';

@Controller('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
export class PublicCandidateProgramController {
  constructor(
    private readonly candidateProgramService: CandidateProgramService,
  ) {}
    @Get("")
    getOverview(){
        return this. candidateProgramService.getoverview()
    }


}
