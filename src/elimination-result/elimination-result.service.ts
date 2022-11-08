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
    private readonly eliminationResultRepo:Repository<EliminationResult>,
    private readonly programService:ProgramsService,
    private readonly candidateService:CandidateService,
    private readonly candidateProgramService:CandidateProgramService,
  ){}

  async create(createEliminationResultDto: CreateEliminationResultDto) {
    try {
    const candidate = await this.candidateService.findCandidateBychestNO(createEliminationResultDto.chestNO)
    const program = await this.programService.findOneByProgramCode(createEliminationResultDto.programCode)
      if (!candidate) throw new NotFoundException('Candidate not found');
      const newResult: EliminationResult =  this.eliminationResultRepo.create(createEliminationResultDto)
      newResult.candidateName= candidate.name;
      newResult.categoryID= candidate.categoryID;
      newResult.insstituteID= candidate.institute.id;
      newResult.totalPoint= 
      createEliminationResultDto.pointOne + 
      createEliminationResultDto.pointTwo +
      createEliminationResultDto.pointThree;
      await this.eliminationResultRepo.save(newResult)
      return newResult ;


  } catch (error) {
      throw error
    }
  }

  async updateSelection(id:number){
    return this.candidateProgramService.updateSelection(id)
  }

  findAllEliminationProgram() {
   return this.programService.findEliminationPrograms()
    return `This action returns all eliminationResult`;
  }

  async findCandidatesOfProgram(code:string)  {
    try {
      const candidate = await this.candidateProgramService.findCandidatesOfProgram(code)
      return candidate
    } catch (error) {
      throw error
    }
  }
  
  async findSelected(code:string){
    try {
      return await this.candidateProgramService.findSelected(code)
    } catch (error) {
      throw error
    }
  }

  update(id: number, updateEliminationResultDto: UpdateEliminationResultDto) {
    return `This action updates a #${id} eliminationResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} eliminationResult`;
  }
}
