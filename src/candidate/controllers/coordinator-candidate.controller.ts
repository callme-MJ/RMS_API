import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidateDTO } from '../dtos/candidate.dto';
import { UpdateCandidateDTO } from '../dtos/update-candidate.dto';
import { CandidateService, ICandidateFilter } from '../services/candidate.service';

@UseGuards(AuthGuard('jwt-coordinator'))
@Controller('coordinator/candidates')
export class CoordinatorCandidatesController {
  constructor(
    private readonly candidateService: CandidateService
  ) { }

  @Get()
  async getCandidates(@Request() req: any, @Query() queryParams: ICandidateFilter) {
    try {
      return await this.candidateService.findAllCandidatesOfInstitute(req.user.id, queryParams);
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async createCandidate(
    @Body() payload: CandidateDTO,
    @UploadedFile() photo: Express.Multer.File,
    @Request() req: any,
  ) {
    return await this.candidateService.createCandidate(payload, photo, req.user.id);
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
    @Body() body: UpdateCandidateDTO,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.candidateService.updateCandidate(+id, body, photo);
  }


}
