import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { FinalResultService } from '../final-result.service';
import { CreateFinalMarkDto } from '../dto/create-final-mark.dto';
import { UpdateFinalMarkDto } from '../dto/update-final-mark.dto';
import { AuthGuard } from '@nestjs/passport';
import { IProgramFilter, ProgramsService } from 'src/program/program.service';
import { CreateFinalResultDTO } from '../dto/create-final-result.dto';
import { CategoryService } from 'src/category/category.service';
import { InstituteService } from 'src/institute/institute.service';
import { SessionService } from 'src/session/session.service';
import { RolesGuard } from 'src/login/user/guards/roles.guard';
import { Role } from 'src/login/interfaces/user-roles.enum';
import { Roles } from 'src/login/user/decorators/roles.decorators';

@UseGuards(AuthGuard('jwt-user'), RolesGuard)
@Roles(Role.MEDIA)
@Controller('user/final-result')
export class MediaFinalResultController {
  constructor(
    private readonly finalResultService: FinalResultService,
    private readonly programService: ProgramsService,
    private readonly categoryService: CategoryService,
    private readonly instituteService: InstituteService,
    private readonly sessionService: SessionService,
  ) {}

  @Get('/programs/published')
  async findAll(@Query() queryParams: IProgramFilter) {
    try {
      const programs =
        this.finalResultService.getPublishedPrograms(queryParams);
      console.log((await programs).length);
      return programs;
    } catch (error) {
      throw error;
    }
  }

  @Get('/programs/allResults')
  async findAllProgramsResults() {
    try {
      const result = this.finalResultService.getAllProgramsResultsPublished();
      console.log((await result).length);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
