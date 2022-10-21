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
import { CandidateDTO } from '../dtos/candidate.dto';
import { PhotoDTO } from '../dtos/photo.dto';
import { ReqQueryDTO } from '../dtos/req-query.dto';
import { Candidate } from '../entities/candidate.entity';
import { InstituteService } from '../services/institute.service';
import { S3Service } from '../services/s3.service';

@Controller('candidates')
export class InstituteController {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    private readonly instituteService: InstituteService,
    private readonly s3Service: S3Service
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
      // const [data, total] = await candidates.getManyAndCount();

      // return { data, total };
      return await this.instituteService.findAllCandidates()
    } catch (error) {
      throw error;
    }
  }
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async createCandidate(
    @Body() candidateDTO: CandidateDTO,
    @UploadedFile() file,
  ) {
    
    // let photo = await this.s3Service.uploadFile(file);
    // let {Location,ETag,Key} = photo; 
    // console.log(Location,ETag,Key);
       
    
    // return await this.instituteService.createCandidate(candidateDTO,Location,ETag,Key);
    return await this.instituteService.createCandidate(candidateDTO,file);
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
    let candidate=await this.instituteService.findCandidateByID(id)
    
    await this.s3Service.deleteFile(candidate);
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
    let candidate=await this.instituteService.findCandidateByID(id)
    await this.s3Service.deleteFile(candidate);
    let photo = await this.s3Service.uploadFile(file);
    let {Location,ETag,Key} = photo;  
    candidateDTO.photoPath=Location;
    candidateDTO.photoETag=ETag;
    candidateDTO.photoKey=Key; 
    return this.instituteService.updateCandidate(id, candidateDTO);
  }

  
}
