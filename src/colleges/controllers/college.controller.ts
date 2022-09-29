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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { storage } from '../config/storage.config';
import { candidateDto } from '../dtos/candidate.dto';
import { CollegesService } from '../services/college.service';

@Controller('colleges')
export class CollegesController {
  constructor(private readonly collegesService: CollegesService) {}

  @Get('/candidates/all')
  getAllCandidates() {
    return this.collegesService.findAllCandidates();
  }

  @Post('/candidates/register')
  @UseInterceptors(FileInterceptor('file', { storage }))
  @UsePipes(ValidationPipe)
  async createCandidate(
    @Body() candidateDto: candidateDto,
    @UploadedFile() file,
  ) {
    return this.collegesService.createCandidate(candidateDto, file);
  }

  @Get('candidates/:id')
  async findCandidateById(
    @Res() response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const candidate = await this.collegesService.findCandidateById(id);
    return response.status(HttpStatus.OK).json({
      candidate,
    });
  }

  @Delete('candidates/:id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.collegesService.deleteCandidate(id);
  }

  @Get('/candidates/')
  async querybuilder(@Req() req: Request) {
    const builder = await this.collegesService.queryBuilder('candidates');

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
