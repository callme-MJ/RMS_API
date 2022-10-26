import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { CandidateService } from 'src/candidate/services/candidate.service';
import { Program } from 'src/programs/entities/program.entity';
import { ProgramsService } from 'src/programs/programs.service';
import { Repository } from 'typeorm';
import { CreateCandidateProgramDTO } from './dto/create-candidate-program.dto';
import { UpdateCandidateProgramDTO } from './dto/update-candidate-program.dto';
import { CandidateProgram } from './entities/candidate-program.entity';

@Injectable()
export class CandidateProgramService {
  constructor(
    @InjectRepository(CandidateProgram)
    private readonly candidateProgramRepository: Repository<CandidateProgram>,
    private readonly candidateService: CandidateService,
    private readonly programsService: ProgramsService,
  ) {}
  public async create(createCandidateProgramDTO: CreateCandidateProgramDTO) {
    try {
      const candidate: Candidate =
        await this.candidateService.findCandidateBychestNO(
          createCandidateProgramDTO.chestNO,
        );
      // console.log(candidate);
      const program: Program = await this.programsService.findOneByProgramCode(
        createCandidateProgramDTO.programCode,
      );

      // console.log(program)
      if (!candidate || !program)
        throw new NotFoundException('Candidate or Program not found');
    
      const newCandidateProgram = await this.candidateProgramRepository.create(
        createCandidateProgramDTO,
      );
      newCandidateProgram.candidate = candidate;
      newCandidateProgram.program = program;
       await this.candidateProgramRepository.save(newCandidateProgram);
       await this.checkEligibility(newCandidateProgram);
      
      
        
      

      return newCandidateProgram;
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.candidateProgramRepository.find();
  }

  findOne(id: number) {
    return this.candidateProgramRepository.findOneBy({ id });
  }

  update(id: number, updateCandidateProgramDto: UpdateCandidateProgramDTO) {
    return this.candidateProgramRepository.update(
      id,
      updateCandidateProgramDto,
    );
  }

  remove(id: number) {
    return this.candidateProgramRepository.delete(id);
  }

  public async checkEligibility(
    newCandidateProgram
  ):Promise<boolean> {
    try {
      const { chestNO, categoryID, programCode } = newCandidateProgram;
      const candidateProgram = await this.candidateProgramRepository
        .createQueryBuilder('candidateProgram')
        .leftJoinAndSelect('candidateProgram.candidate', 'candidate')
        .leftJoinAndSelect('candidateProgram.program', 'program')
        .leftJoinAndSelect('program.category', 'category')
        .leftJoinAndSelect('candidate.institute', 'institute')
        .leftJoinAndSelect('institute.session', 'session');

      const instituteID= await candidateProgram
      .where('candidate.chestNO = :chestNO', { chestNO })
      .select('institute.id')
      .getRawOne();
      
      const duplicate = await candidateProgram
        .where('institute.id = :instituteID', {
          instituteID,
        })
        .andWhere('program.programCode = :programCode', {
          programCode,
        })
        .select('candidateProgram.id')
        .getCount();

      if (duplicate > 1) {
        await this.candidateProgramRepository.delete(
          newCandidateProgram.id,
        );
         throw new NotFoundException(
          'Institute already enrolled in this program',
        );
      }

      let single = await candidateProgram
        .where('candidate.chestNO = :chestNO', {
          chestNO,
        })
        .andWhere('program.type = :type', {
          type: 'single',
        })
        .select('candidateProgram.id')
        .getCount();
      if (single >= 6) {
        await this.candidateProgramRepository.delete(
          newCandidateProgram.id,
        );
        throw new NotFoundException(
          'Candidate already enrolled in 6 single program',
        );
      }

      let stage= await candidateProgram
        .where('candidate.chestNO = :chestNO', {
          chestNO,
        })
        .andWhere('program.type = :type', {
          type: 'single', 
        })
        .andWhere('program.mode = :mode', {
          mode: 'stage',
        })
        .select('candidateProgram.id')
        .getCount();

      if (stage >= 4) {
        await this.candidateProgramRepository.delete(
          newCandidateProgram.id,
        );
        throw new NotFoundException(
          'Candidate already enrolled in 4 stage program',
        )};

      let nonStage =single-stage;
      if (nonStage >= 4) {
        await this.candidateProgramRepository.delete(
          newCandidateProgram.id,
        );
        throw new NotFoundException(
          'Candidate already enrolled in 4 non-stage program',
        )};
      
      let curbGroupData = await candidateProgram
      .where('program.program_code = :programCode', {
        programCode,
        })
      .select('program.curb_group')
      .getRawOne();
      let result = Object.values(JSON.parse(JSON.stringify(curbGroupData)));
      let curbGroup = result[0];
      
      let countCurbGroup = await candidateProgram
      .where('candidate.chestNO = :chestNO', {
        chestNO,
        })
      .andWhere('program.curb_group = :curbGroup', {
        curbGroup,
        })
      .select('candidateProgram.id')
      .getCount();
      console.log(countCurbGroup);
      


        

      return true;
    } catch (error) {
      throw error;
    }
  }
}
