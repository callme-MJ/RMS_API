import {
  Body,
  Controller,
  Delete,
  Get, Param,
  ParseIntPipe, Patch, Post,
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
import { storage } from '../../utils/storage.config';
import { CandidateDTO } from '../dtos/candidate.dto';
import { ReqQueryDTO } from '../dtos/req-query.dto';
import { Candidate } from '../entities/candidate.entity';
import { InstituteService } from '../services/institute.service';

@Controller('candidates')
export class InstituteController {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    private readonly instituteService: InstituteService,
  ) {}
 
  @Get('/')
  async getCandidate(@Req() req: Request) {
    try {
      
      const candidates = await this.candidateRepository.createQueryBuilder(
        'candidates',
      );
      let search = (req.query as unknown as ReqQueryDTO).search,
        sort = (req.query as unknown as ReqQueryDTO).sort,
        page = (req.query as unknown as ReqQueryDTO).page || 1;
      if (search) {
        candidates.where(
          'name LIKE :search OR category_ID LIKE :search OR chestNO LIKE :search',
          { search: `%${search}%` },
        );
      }

      if (sort) {
        candidates.orderBy('candidates.name', sort.toUpperCase()).getMany();
      }

      const perPage = 15;
      candidates.offset((page - 1) * perPage).limit(perPage);
      const [data, total] = await candidates.getManyAndCount();

      return { data, total };
    } catch (error) {
      throw error;
    }
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

  @Get('/:chestNO')
  async findCandidateByChestNo(
    @Res() response,
    @Param('chestNO', ParseIntPipe) chestNO: string,
  ) {
    return await this.instituteService.findCandidateByChestNo(chestNO);
  }

  @Delete('/:id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.instituteService.deleteCandidate(id);
  }
  @Patch('/:id')
  @UseInterceptors(FileInterceptor('file', { storage }))
  @UsePipes(ValidationPipe)
  async updateCandidate(
    @Param('id', ParseIntPipe) id: number,
    @Body() candidateDTO: CandidateDTO,
  ) {
    console.log(id);
    
    return this.instituteService.updateCandidate(id, candidateDTO);
  }

}
