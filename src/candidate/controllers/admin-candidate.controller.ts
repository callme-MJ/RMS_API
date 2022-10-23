import {
  Body,
  Controller,
  Delete,
  Get, Param,
  ParseIntPipe, Patch, Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidateDTO } from '../dtos/candidate.dto';
import { CandidateService, ICandidateFilter } from '../services/candidate.service';

@Controller('admin/candidates')
export class AdminCandidatesController {
  constructor(
    private readonly candidateService: CandidateService
  ) { }

  @Get()
  async getCandidates(@Query() queryParams: ICandidateFilter) {
    try {
      return await this.candidateService.findAllCandidates(queryParams)
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createCandidate(
    @Body() payload: CandidateDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.candidateService.createCandidate(payload, file);
  }

  @Get(':chestNO')
  async findCandidateBychestNO(
    @Param('chestNO', ParseIntPipe) chestNO: number,
  ) {
    return await this.candidateService.findCandidateBychestNO(+chestNO);
  }

  @Delete(':id')
  async deleteCandidateByID(@Param('id', ParseIntPipe) id: number) {
    return this.candidateService.deleteCandidate(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async updateCandidate(
    @Param('id', ParseIntPipe) id: number,
    @Body() candidateDTO: CandidateDTO,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.candidateService.updateCandidate(+id, candidateDTO, photo);
  }
}
