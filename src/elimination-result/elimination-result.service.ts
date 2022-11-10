import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateProgramService } from 'src/candidate-program/candidate-program.service';
import { CandidateProgram } from 'src/candidate-program/entities/candidate-program.entity';
import { CandidateService } from 'src/candidate/services/candidate.service';
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
      program.resultEntered = EnteringStatus.TRUE;
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

  async findCandidatesOfProgram(code: string) {
    try {
      const candidate =
        await this.candidateProgramService.findCandidatesOfProgram(code);
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
      if (!chestNO || !programCode)
        throw new NotFoundException('data not found');
      const result = await this.eliminationResultRepo.findOne({
        where: {
          chestNO: chestNO,
          programCode: programCode,
        },
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

  remove(id: number) {
    return this.eliminationResultRepo.delete(id);
  }

  async publishResult(programCode: string) {
    try {
      const program = await this.programService.findOneByProgramCode(programCode);
      if (!program) throw new NotFoundException('Program not found');
      program.resultPublished = PublishingStatus.TRUE;
      await this.programService.update(program.id, program);
      return program;
    } catch (error) {
      throw error;
    }
  }

}
