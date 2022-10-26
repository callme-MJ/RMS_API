import {
  Body,
  Controller,
  Delete,
  Get, Param,
  ParseIntPipe, Patch, Post,
  Query,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidateDTO } from '../dtos/candidate.dto';
import { UpdateCandidateDTO } from '../dtos/update-candidate.dto';
import { CandidateService, ICandidateFilter } from '../services/candidate.service';

// @UseGuards(AuthGuard('jwt-admin'))
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
  @UseInterceptors(FileInterceptor('photo'))
  async createCandidate(
    @Body() payload: CandidateDTO,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return await this.candidateService.createCandidate(payload, photo);
  }
  
  @SerializeOptions({ groups: ['single'] })
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
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('photo'))
  async updateCandidate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCandidateDTO,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.candidateService.updateCandidate(+id, body, photo);
  }
}
