import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { storage } from '../../utils/storage.config';
import { CandidateDTO } from '../dtos/candidate.dto';
import { instituteService } from '../services/institute.service';

@Controller('candidates')
export class instituteController {
  constructor(private readonly instituteService: instituteService) {}

  @Get('/')
  async getCandidate(@Req() req: Request) {
    const candidates = await this.instituteService.queryBuilder('candidates');

    if (req.query.search) {
      candidates.where(
        'candidates.name LIKE :search OR candidates.ad_no LIKE :search OR candidates.chest_No LIKE :search',
        { search: `%${req.query.search}%` },
      );
    }

    const sort: any = req.query.sort;
    if (sort) {
      candidates.orderBy('candidates.name', sort.toUpperCase()).getMany();
    }

    const page: number = parseInt(req.query.page as any) || 1;
    const perPage = 15;
    candidates.offset((page - 1) * perPage).limit(perPage);
    const [data, total] = await candidates.getManyAndCount();

    return { data, total };
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('file', { storage }))
  @UsePipes(ValidationPipe)
  async createCandidate(
    @Body() candidateDTO: CandidateDTO,
    @UploadedFile() file,
  ) {
    return await this.instituteService.createCandidate(candidateDTO, file);
  }

  @Get('/:chest_No')
  async findCandidateByChestNo(
    @Res() response,
    @Param('chest_No', ParseIntPipe) chest_NO: number,
  ) {
    return await this.instituteService.findCandidateByChestNo(chest_NO);
  }

  @Delete('/:id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.instituteService.deleteCandidate(id);
  }
}
