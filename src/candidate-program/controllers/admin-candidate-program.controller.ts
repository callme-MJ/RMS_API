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
import { AuthGuard } from '@nestjs/passport';
import { get } from 'http';
import { ICandidateFilter } from 'src/candidate/services/candidate.service';
import {
  CandidateProgramService,
  ICandidateProgramFIilter,
} from '../candidate-program.service';
import { CreateCandidateProgramDTO } from '../dto/create-candidate-program.dto';
import { CreateTopicStatusDTO } from '../dto/create-status-topic.dto';
import { CreateTopicProgramDTO } from '../dto/create-topic-program.dto';
import { UpdateCandidateProgramDTO } from '../dto/update-candidate-program.dto';

@UseGuards(AuthGuard('jwt-admin'))
@Controller('admin/candidate-programs')
export class AdminCandidateProgramController {
  constructor(
    private readonly candidateProgramService: CandidateProgramService,
  ) {}

  // @Post()
  // @UsePipes(ValidationPipe)
  // create(@Body() createCandidateProgramDto: CreateCandidateProgramDTO) {
  //   return this.candidateProgramService.create(createCandidateProgramDto);
  // }

  @Get()
  findAll(@Query() queryParams: ICandidateProgramFIilter) {
    return this.candidateProgramService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
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
  async getAllcandidateProgramsOfInsititute() {
    try {
      return await this.candidateProgramService.findCandidatePrograms();
    } catch (error) {}
  }

  @Get('/topics/all')
  async getAllTopicsOfInstitute(@Request() req: any) {
    try {
      return await this.candidateProgramService.findAllTopics(
        req.user.id,
      );
    } catch (error) {
      throw error;
    }
  }

  // @Post('/topics/:id')
  // async updateStutusTopic(@Param("id") id: number, @Body() createTopicStatusDTO: CreateTopicStatusDTO) {
  //   try {
  //     return await this.candidateProgramService.createTopic(createTopicProgramDto,id);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

}
