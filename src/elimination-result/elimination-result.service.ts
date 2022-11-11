import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateProgramService, ICandidateFIilter, ICandidateProgramFIilter } from 'src/candidate-program/candidate-program.service';
import { CandidateProgram, SelectionStatus } from 'src/candidate-program/entities/candidate-program.entity';
import { CandidateService } from 'src/candidate/services/candidate.service';
import { CategoryService } from 'src/category/category.service';
import { EnteringStatus, PublishingStatus } from 'src/program/entities/program.entity';
import { ProgramsService } from 'src/program/program.service';
import { Repository } from 'typeorm';
import { CreateEliminationResultDto } from './dto/create-elimination-result.dto';
import { UpdateEliminationResultDto } from './dto/update-elimination-result.dto';
import { EliminationResult } from './entities/elimination-result.entity';

@Injectable()
export class EliminationResultService {
  constructor(
    @InjectRepository(EliminationResult)
    private readonly eliminationResultRepo: Repository<EliminationResult>,
    @InjectRepository(CandidateProgram)
    private readonly CandidateProgramRepo: Repository<CandidateProgram>,
    private readonly programService: ProgramsService,
    private readonly candidateService: CandidateService,
    private readonly candidateProgramService: CandidateProgramService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createEliminationResultDto: CreateEliminationResultDto) {
    try {
      const eliminationResult = await this.eliminationResultRepo.find({
        where: {
          chestNO: createEliminationResultDto.chestNO,
          programCode: createEliminationResultDto.programCode,
        },
      });
      const candidateProgram = await this.CandidateProgramRepo.findOne({
        where: {
          chestNO: createEliminationResultDto.chestNO,
          programCode: createEliminationResultDto.programCode,
        },
      });
      if (eliminationResult.length > 0)
        throw new NotFoundException('Result already exists');
      if (!candidateProgram)
        throw new NotFoundException(
          'Candidate not found as registered for this program',
        );

      const candidate = await this.candidateService.findCandidateBychestNO(
        createEliminationResultDto.chestNO,
      );
      const program = await this.programService.findOneByProgramCode(
        createEliminationResultDto.programCode,
      );
      if (!candidate) throw new NotFoundException('Candidate not found');
      const newResult: EliminationResult = this.eliminationResultRepo.create(
        createEliminationResultDto,
      );
      // program.resultEntered = EnteringStatus.TRUE;
      newResult.candidateName = candidate.name;
      newResult.categoryID = candidate.categoryID;
      newResult.instituteID = candidate.institute.id;
      newResult.programName = program.name;
      newResult.candidateProgram = candidateProgram;
      newResult.totalPoint = 
      createEliminationResultDto.pointOne +
      createEliminationResultDto.pointTwo +
      createEliminationResultDto.pointThree ;

      await this.eliminationResultRepo.save(newResult);
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

  findAllEliminationProgram() {
    return this.programService.findEliminationPrograms();
  }
  findAllPublishedEliminationProgram(){
    return this.programService.findAllPublishedEliminationProgram();
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
  async findCandidatesOfPublishedProgram(code: string,queryParams:ICandidateProgramFIilter) {
    try {
      const candidate =
        await this.candidateProgramService.findCandidatesOfPublishedProgram(code,queryParams);
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
      const result = await this.eliminationResultRepo.findOne({
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
      const result = await this.eliminationResultRepo.find({
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

  update(id: number, updateEliminationResultDto: UpdateEliminationResultDto) {
    return `This action updates a #${id} eliminationResult`;
  }

  async remove(id: number) {
      try {
          const result = await this.eliminationResultRepo.findOneBy({id});
          if(!result) throw new NotFoundException('Result not found');
          await this.candidateProgramService.deleteSelection(result.candidateProgram.id);
          return await this.eliminationResultRepo.remove(result);

      } catch (error) {
          throw error;
      }
    // await this.candidateProgramService.deleteSelection(id);
    // return this.eliminationResultRepo.delete(id);
  }

  async publishResult(programCode: string) {
    try {
      const program = await this.programService.findOneByProgramCode(programCode);
      if (!program) throw new NotFoundException('Program not found');
      // if(program.resultEntered === EnteringStatus.FALSE) throw new NotFoundException('Result not entered completely');
      // program.resultPublished = PublishingStatus.TRUE;
      await this.programService.update(program.id, program);
      return program;
    } catch (error) {
      throw error;
    }
  }
  

  // async findAllSelectedPrograms() {
  //   try {
  //     return await this.CandidateProgramRepo.createQueryBuilder('candidateProgram')
  //     .leftJoinAndSelect('candidateProgram.program', 'program')
  //     .where('program.resultPublished = :resultPublished', { resultPublished: PublishingStatus.TRUE })
  //     .where('candidateProgram.isSelected = :selected', { selected: SelectionStatus.TRUE })
  //     .groupBy('program.id')
  //     .getMany();


  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
