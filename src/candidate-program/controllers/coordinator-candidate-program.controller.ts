import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { identity } from 'rxjs';
import { ICandidateFilter } from 'src/candidate/services/candidate.service';
import { CandidateProgramService } from '../candidate-program.service';
import { CreateCandidateProgramDTO } from '../dto/create-candidate-program.dto';
import { CreateTopicProgramDTO } from '../dto/create-topic-program.dto';
import { UpdateCandidateProgramDTO } from '../dto/update-candidate-program.dto';

@UseGuards(AuthGuard('jwt-coordinator'))
@Controller('coordinator/candidate-programs')
export class CoordinatorCandidateProgramController {
  constructor(
    private readonly candidateProgramService: CandidateProgramService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createCandidateProgramDto: CreateCandidateProgramDTO) {
    return this.candidateProgramService.create(createCandidateProgramDto);
  }

  @Get()
  async getAllCandidteProgramsOfInstitute(
    @Request() req: any,
    @Query() queryParams: ICandidateFilter,
  ) {
    try {
      return await this.candidateProgramService.findAllCandidateProgramsOfInstitute(
        req.user.id,
        queryParams,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.candidateProgramService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCandidateProgramDto: CreateCandidateProgramDTO,
  ) {
    return this.candidateProgramService.update(+id, updateCandidateProgramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.candidateProgramService.remove(+id);
  }

  @Get('/candidates/all')
  async getAllcandidateProgramsOfInsititute(@Request() req: any) {
    try {
      return await this.candidateProgramService.findCandidateProgramsByInstitute(
        req.user.id,
      );
    } catch (error) {}
  }

  @Get('/candidateCard/:id')
  async getAllCandidteProgramsOfByChestNO(
    @Request() req: any,
    @Param('id') id: number,
  ) {
    try {
      console.log(req.user.id);
      return await this.candidateProgramService.findCandidateProgramsByChestNO(
        id,
        req.user.id,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('topics')
  async getAlltopics(@Request() req: any) {
    try {
      return await this.candidateProgramService.findAllTopics(req.user.id);
    } catch (error) {
      throw error;
    }
  }
}
