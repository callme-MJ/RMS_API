import { Injectable } from '@nestjs/common';
import { CandidateProgramService } from 'src/candidate-program/candidate-program.service';
import { ProgramsService } from 'src/program/program.service';
import { CreateEliminationResultDto } from './dto/create-elimination-result.dto';
import { UpdateEliminationResultDto } from './dto/update-elimination-result.dto';

@Injectable()
export class EliminationResultService {
  constructor(
    private readonly programService:ProgramsService,
    private readonly candidateProgramService:CandidateProgramService,
  ){}

  create(createEliminationResultDto: CreateEliminationResultDto) {
    return 'This action adds a new eliminationResult';
  }

  findAllEliminationProgram() {
   return this.programService.findEliminationPrograms();
  }

  async findCandidatesOfProgram(code:string)  {
    try {
      const candidate = await this.candidateProgramService.findCandidatesOfProgram(code)
      console.log(candidate)
      return candidate
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
