import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Query, Request,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CandidateProgramService } from '../candidate-program.service';
import { CreateCandidateProgramDTO } from '../dto/create-candidate-program.dto';
import { CreateTopicProgramDTO } from '../dto/create-topic-program.dto';

@UseGuards(AuthGuard('jwt-coordinator'))
@Controller('coordinator/candidate-programs')
export class CoordinatorCandidateProgramController {
  constructor(
    private readonly candidateProgramService: CandidateProgramService,
  ) {}

  @Get()
  async getAllCandidateProgramsofInstitute(@Request() req: any,@Query() queryParams: any) {
    return await this.candidateProgramService.findAllCandidateProgramsOfInstitute(req.user.id,queryParams);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createCandidateProgramDto: CreateCandidateProgramDTO, @Request() req: any) {
    return this.candidateProgramService.create(createCandidateProgramDto,req.user.id);
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

  @Get('/topics/all')
  async getAllTopicsOfInstitute(@Request() req: any) {
    try {
      return await this.candidateProgramService.findAllTopicsOfInstitute(
        req.user.id,
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('/topics/:id')
  async createTopic(@Param("id") id: number, @Body() createTopicProgramDto: CreateTopicProgramDTO) {
    try {
      return await this.candidateProgramService.createTopic(createTopicProgramDto,id);
    } catch (error) {
      throw error;
    }
  }

  @Get('/selection')
  async getSelectedCandidates(@Request() req: any) {
    try {
      return await this.candidateProgramService.getSelectedCandidates(req.user.id);
    } catch (error) {
      throw error;
    }
  }
}
