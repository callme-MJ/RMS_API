import {
  Body,
  Controller,
  Delete,
  Get, Param,
  ParseIntPipe, Patch, Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { CandidateDTO } from '../dtos/candidate.dto';
import { Candidate } from '../entities/candidate.entity';
import { IFilter } from '../interfaces/filter.interface';
import { InstituteService } from '../services/institute.service';
import { S3Service } from '../services/s3.service';

@Controller('candidates')
export class InstituteController {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    private readonly instituteService: InstituteService,
    private readonly s3Service: S3Service
  ) { }

  @Get()
  async getCandidates(@Query() queryParams: IFilter) {
    try {

      const candidates = await this.candidateRepository.createQueryBuilder(
        'candidates',
      );

      const search = queryParams.search;
      const sort = queryParams.sort;
      const page = queryParams.page || 10;

      if (search) {
        candidates.where(
          'name LIKE :search OR chestNO LIKE :search',
          { search: `%${search}%` },
        );
      }

      if (sort) {
        candidates.orderBy('candidates.name', sort).getMany();
      }

      const perPage = 15;
      candidates.offset((page - 1) * perPage).limit(perPage);
      // const [data, total] = await candidates.getManyAndCount();

      // return { data, total };
      return await this.instituteService.findAllCandidates()
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
    return await this.instituteService.createCandidate(payload, file);
  }

  @Get('/:chestNO')
  async findCandidateBychestNO(
    @Res() response,
    @Param('chestNO', ParseIntPipe) chestNO: string,
  ) {
    return await this.instituteService.findCandidateBychestNO(chestNO);
  }

  @Delete('/:id')
  async deleteCandidateByID(@Param('id', ParseIntPipe) id: number) {

    return this.instituteService.deleteCandidate(id);
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async updateCandidate(
    @Param('id', ParseIntPipe) id: number,
    @Body() candidateDTO: CandidateDTO,
    @UploadedFile() file,
  ) {
    return this.instituteService.updateCandidate(id, candidateDTO, file);
  }


}
