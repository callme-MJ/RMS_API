import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateProgramService } from 'src/candidate-program/candidate-program.service';
import { CandidateService } from 'src/candidate/services/candidate.service';
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
    private readonly programService: ProgramsService,
    private readonly candidateService: CandidateService,
    private readonly candidateProgramService: CandidateProgramService,
  ) { }

  async create(createEliminationResultDto: CreateEliminationResultDto) {
    try {
      const eliminationResult = await this.eliminationResultRepo.find({
        where: {
          chestNO: createEliminationResultDto.chestNO,
          programCode: createEliminationResultDto.programCode
        }
      })
      if (eliminationResult.length > 0) {
        throw new NotFoundException('Result already exist')
      }
      const candidate = await this.candidateService.findCandidateBychestNO(createEliminationResultDto.chestNO)
      const program = await this.programService.findOneByProgramCode(createEliminationResultDto.programCode)
      if (!candidate) throw new NotFoundException('Candidate not found');
      const newResult: EliminationResult = this.eliminationResultRepo.create(createEliminationResultDto)
      newResult.candidateName = candidate.name;
      newResult.categoryID = candidate.categoryID;
      newResult.insstituteID = candidate.institute.id;
      newResult.programName = program.name;
      newResult.totalPoint =
        createEliminationResultDto.pointOne +
        createEliminationResultDto.pointTwo +
        createEliminationResultDto.pointThree;
      
      await this.eliminationResultRepo.save(newResult)
      return newResult;
    } catch (error) {
      throw error
    }
  }

  async updateSelection(id: number) {
    return this.candidateProgramService.updateSelection(id)
  }

  findAllEliminationProgram() {
    return this.programService.findEliminationPrograms()
  }

  async findCandidatesOfProgram(code: string) {
    try {
      const candidate = await this.candidateProgramService.findCandidatesOfProgram(code)
      return candidate
    } catch (error) {
      throw error
    }
  }

  async findSelected(code: string) {
    try {
      return await this.candidateProgramService.findSelected(code)
    } catch (error) {
      throw error
    }
  }

  async findPoints(chestNO: number, programCode: string) {
    try {
      if (!chestNO || !programCode) throw new NotFoundException('data not found')
      const result = await this.eliminationResultRepo.findOne({
        where: {
          chestNO: chestNO,
          programCode: programCode
        }
      })
      if (!result) throw new NotFoundException('Result not found')
      return result

    } catch (error) {
      throw error
    }
  }

  async findPointsByProgramCode(param: string) {
    try {
      const result = await this.eliminationResultRepo.find({ 
        where: { programCode: param}
       })
      if (!result) throw new NotFoundException('Result not found')
      return result

    } catch (error) {
      throw error
    }
  }

  update(id: number, updateEliminationResultDto: UpdateEliminationResultDto) {
    return `This action updates a #${id} eliminationResult`;
  }

  remove(id: number) {
    return this.eliminationResultRepo.delete(id);
  }
}
