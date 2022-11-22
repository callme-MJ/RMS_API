import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateProgramService, ICandidateFIilter, ICandidateProgramFIilter } from 'src/candidate-program/candidate-program.service';
import { CandidateProgram, SelectionStatus } from 'src/candidate-program/entities/candidate-program.entity';
import { CandidateService } from 'src/candidate/services/candidate.service';
import { CategoryService } from 'src/category/category.service';
import { InstituteService } from 'src/institute/institute.service';
import { EnteringStatus, PublishingStatus } from 'src/program/entities/program.entity';
import { IProgramFilter, ProgramsService } from 'src/program/program.service';
import { Repository } from 'typeorm';
import { CreateFinalResultDTO } from './dto/create-Final-result.dto';
import { UpdateFinalResultDTO } from './dto/update-Final-result.dto';
import { FinalResult } from './entities/Final-result.entity';

@Injectable()
export class FinalResultService {
  constructor(
    @InjectRepository(FinalResult)
    private readonly FinalResultRepo: Repository<FinalResult>,
    @InjectRepository(CandidateProgram)
    private readonly CandidateProgramRepo: Repository<CandidateProgram>,
    private readonly programService: ProgramsService,
    private readonly candidateService: CandidateService,
    private readonly candidateProgramService: CandidateProgramService,
    private readonly categoryService: CategoryService,
    private readonly instituteService: InstituteService,
  ) {}

  async create(createFinalResultDto: CreateFinalResultDTO) {
    try {
      const FinalResult = await this.FinalResultRepo.find({
        where: {
          chestNO: createFinalResultDto.chestNO,
          programCode: createFinalResultDto.programCode,
        },
      });
      const candidateProgram = await this.CandidateProgramRepo.findOne({
        where: {
          chestNO: createFinalResultDto.chestNO,
          programCode: createFinalResultDto.programCode,
        },
      });
      if (FinalResult.length > 0)
        throw new NotFoundException('Result already exists');
      if (!candidateProgram)
        throw new NotFoundException(
          'Candidate not found as registered for this program',
        );

      const candidate = await this.candidateService.findCandidateBychestNO(
        createFinalResultDto.chestNO,
      );
      const program = await this.programService.findOneByProgramCode(
        createFinalResultDto.programCode,
      );
      if (!candidate) throw new NotFoundException('Candidate not found');
      const newResult: FinalResult = this.FinalResultRepo.create(
        createFinalResultDto,
      );
      newResult.candidateName = candidate.name;
      newResult.categoryID = candidate.categoryID;
      newResult.instituteID = candidate.institute.id;
      newResult.programName = program.name;
      newResult.candidateProgram = candidateProgram;
      newResult.totalPoint = 
      createFinalResultDto.pointOne +
      createFinalResultDto.pointTwo +
      createFinalResultDto.pointThree ;
      // const arr = [createFinalResultDto.pointOne,createFinalResultDto.pointTwo,createFinalResultDto.pointThree];
      // const countJudge = (arr.filter(obj => obj > 0).length);
      // newResult.percentage= (newResult.totalPoint/countJudge*100)*100;

      await this.FinalResultRepo.save(newResult);
      return newResult;
    } catch (error) {
      throw error;
    }
  }

  async updateSelection(id: number) {
    return this.candidateProgramService.updateSelection(id);
  }

  async deleteSelection(id: number) {
    return this.candidateProgramService.deleteSelection(id);
  }

  findAll(queryParams:IProgramFilter) {
    return this.programService.findAll(queryParams);
  }

  findAllPublishedEliminationProgram(){
    return this.programService.findAllPublishedEliminationProgram();
  }

  findAllPublishedFinalProgram(){
    return this.programService.findAllPublishedFinalProgram();
  }

  async findCandidatesOfProgram(code: string) {
    try {
      const candidate =
        await this.candidateProgramService.findCandidatesOfProgram(code);
      return candidate;
    } catch (error) {
      throw error;
    }
  }
  async findCandidatesOfPublishedProgram(code: string) {
    try {
      const candidate =
        await this.candidateProgramService.findCandidatesOfPublishedProgram(code);
      return candidate;
    } catch (error) {
      throw error;
    }
  }
  async findSelectedOfInstitute(id: number) {
    try {
      const candidate =
        await this.candidateProgramService.findSelectedOfInstitute(id);
      return candidate;
    } catch (error) {
      throw error;
    }
  }

  async findSelected(code: string) {
    try {
      return await this.candidateProgramService.findSelected(code);
    } catch (error) {
      throw error;
    }
  }

  async findPoints(chestNO: number, programCode: string) {
    try {
      // if (!chestNO || !programCode)
      //   throw new NotFoundException('data not found');
      const result = await this.FinalResultRepo.findOne({
        where: {
          chestNO: chestNO,
          programCode: programCode,
        },
        order: {
          totalPoint: 'DESC',
      }
      });
      if (!result) throw new NotFoundException('Result not found');
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findPointsByProgramCode(param: string) {
    try {
      const result = await this.FinalResultRepo.find({
        where: { programCode: param },
        order: {
          totalPoint: 'DESC',
        },
      });
      if (!result) throw new NotFoundException('Result not found');
      return result;
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateFinalResultDto: UpdateFinalResultDTO) {
    return `This action updates a #${id} FinalResult`;
  }

  async remove(id: number) {
      try {
          const result = await this.FinalResultRepo.findOneBy({id});
          if(!result) throw new NotFoundException('Result not found');
          await this.candidateProgramService.deleteSelection(result.candidateProgram.id);
          return await this.FinalResultRepo.remove(result);

      } catch (error) {
          throw error;
      }
    // await this.candidateProgramService.deleteSelection(id);
    // return this.FinalResultRepo.delete(id);
  }

  async publishResult(programCode: string) {
    try {
      const program = await this.programService.findOneByProgramCode(programCode);
      if (!program) throw new NotFoundException('Program not found');
      if(program.resultEntered != EnteringStatus.TRUE) throw new NotFoundException('Result not entered completely');
      program.resultPublished = PublishingStatus.TRUE;
      await this.programService.update(program.id, program);
      return program;
    } catch (error) {
      throw error;
    }
  }
  async unpublishResult(programCode: string) {
    try {
      const program = await this.programService.findOneByProgramCode(programCode);
      if (!program) throw new NotFoundException('Program not found');
      program.resultPublished = PublishingStatus.FALSE;
      await this.programService.update(program.id, program);
      return program;
    } catch (error) {
      throw error;
    }
  }
  

  findInstitutes(sessionID: number){
    return this.instituteService.findAll(sessionID);
  }

  async findInstituteCount(sessionID: number,id?: number){
    const count= await this.CandidateProgramRepo.createQueryBuilder('candidateProgram')
    .leftJoinAndSelect('candidateProgram.program', 'program')
    .leftJoinAndSelect('candidateProgram.institute', 'institute')
    .where('program.resultPublished = :resultPublished', {resultPublished: PublishingStatus.TRUE})
    .andWhere('candidateProgram.isSelected = :selected', {selected: SelectionStatus.TRUE})
    .select('candidateProgram.institute.id', 'instituteID')
    .addSelect('count(candidateProgram.id)', 'count')
    .addSelect('institute.name', 'instituteName')
    .addSelect('institute.shortName', 'instituteShortName')
    .groupBy('candidateProgram.institute.id')
    .getRawMany();
    return count;
  }
  async findInstituteCountByCategory(categoryID: number){
    const count= await this.CandidateProgramRepo.createQueryBuilder('candidateProgram')
    .leftJoinAndSelect('candidateProgram.program', 'program')
    .leftJoinAndSelect('candidateProgram.institute', 'institute')
    .where('program.resultPublished = :resultPublished', {resultPublished: PublishingStatus.TRUE})
    .andWhere('candidateProgram.isSelected = :selected', {selected: SelectionStatus.TRUE})
    .andWhere('program.categoryID = :category',{category: categoryID})
    .select('candidateProgram.institute.id', 'instituteID')
    .addSelect('count(candidateProgram.id)', 'count')
    .addSelect('institute.name', 'instituteName')
    .addSelect('institute.shortName', 'instituteShortName')
    .groupBy('candidateProgram.institute.id')
    .getRawMany();
    return count;
  }


  findCategories(sessionID: number){
    return this.categoryService.findAll(sessionID);
  }
}
