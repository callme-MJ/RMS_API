import {
  Controller,
  Req,
  HttpStatus,
  Delete,
  Param,
  ParseIntPipe,
  Get,
  Body,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { storage } from '../../utils/storage.config';
import { CandidateDTO } from '../dtos/candidate.dto';
import { Candidate } from '../entities/candidate.entity';
import { instituteService } from '../services/institute.service';

@Controller('candidates')
export class instituteController {
  constructor(private readonly instituteService: instituteService) {}

  @Get('/')
  async getAllCandidates():Promise<Candidate[]> {
    return await this.instituteService.findAllCandidates();
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('file', { storage }))
  @UsePipes(ValidationPipe)
  async createCandidate(
    @Body() CandidateDTO: CandidateDTO,
    @UploadedFile() file,
  ) {
    return await this.instituteService.createCandidate(CandidateDTO, file);
  }

  @Get('/:chest_No')
  async findCandidateByChestNo(
    @Res() response,
    @Param('chest_No', ParseIntPipe) chest_NO: number,
  ) {
    const candidate = await this.instituteService.findCandidateByChestNo(chest_NO);
    
    return response.status(HttpStatus.OK).json({
      candidate,
    });
  }

  @Delete('/:id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.instituteService.deleteCandidate(id);
  }

  @Get('/')
  async querybuilder(@Req() req: Request) {
    const builder = await this.instituteService.queryBuilder('candidates');

    if (req.query.search) {
      builder.where(
        'candidates.id LIKE :search OR candidates.name LIKE :search OR candidates.ad_no LIKE :search',
        { search: `%${req.query.search}%` },
      );
    }

    const sort: any = req.query.sort;
    if (sort) {
      builder.orderBy('candidates.id', sort.toUpperCase());
    }

    const page: number = parseInt(req.query.page as any) || 1;
    const perPage = 3;
    builder.offset((page - 1) * perPage).limit(perPage);
    const total = await builder.getCount();

    return {
      data: await builder.getMany(),
      total,
      page,
    };
  }
}
