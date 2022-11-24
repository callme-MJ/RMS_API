import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateProgramService } from 'src/candidate-program/candidate-program.service';
import {
  CandidateProgram,
  Grade,
  SelectionStatus,
} from 'src/candidate-program/entities/candidate-program.entity';
import { CandidateService } from 'src/candidate/services/candidate.service';
import {
  EnteringStatus,
  Program,
  PublishingStatus,
} from 'src/program/entities/program.entity';
import { IProgramFilter, ProgramsService } from 'src/program/program.service';
import { Between, Not, Repository } from 'typeorm';
import { CreateFinalMarkDto } from './dto/create-final-mark.dto';
import { CreateFinalResultDTO } from './dto/create-final-result.dto';
import { UpdateFinalMarkDto } from './dto/update-final-mark.dto';
import { FinalMark } from './entities/final-mark.entity';

@Injectable()
export class FinalResultService {
  constructor(
    @InjectRepository(FinalMark)
    private readonly FinalMarkRepo: Repository<FinalMark>,
    @InjectRepository(CandidateProgram)
    private readonly CandidateProgramRepo: Repository<CandidateProgram>,
    @InjectRepository(Program)
    private readonly ProgramRepo: Repository<Program>,
    private readonly candidateProgramService: CandidateProgramService,
    private readonly candidateService: CandidateService,
    private readonly ProgramsService: ProgramsService,
  ) {}
  async findCandidatesOfProgram(code: string) {
    try {
      const candidate =
        await this.candidateProgramService.findCandidatesOfProgramOfFinal(code);
      return candidate;
    } catch (error) {
      throw error;
    }
  }
  async entryMarks(CreateFinalMarkDto: CreateFinalMarkDto) {
    try {
      const FinalMark = await this.FinalMarkRepo.find({
        where: {
          chestNO: CreateFinalMarkDto.chestNO,
          programCode: CreateFinalMarkDto.programCode,
        },
      });
      const candidateProgram = await this.CandidateProgramRepo.findOne({
        where: {
          chestNO: CreateFinalMarkDto.chestNO,
          programCode: CreateFinalMarkDto.programCode,
        },
      });
      if (FinalMark.length > 0)
        throw new NotFoundException('Mark already exists');
      if (!candidateProgram)
        throw new NotFoundException(
          'Candidate not found as registered for this program',
        );

      const candidate = await this.candidateService.findCandidateBychestNO(
        CreateFinalMarkDto.chestNO,
      );
      const program = await this.ProgramsService.findOneByProgramCode(
        CreateFinalMarkDto.programCode,
      );
      if (!candidate) throw new NotFoundException('Candidate not found');
      const newResult: FinalMark =
        this.FinalMarkRepo.create(CreateFinalMarkDto);
      // program.resultEntered = EnteringStatus.TRUE;
      newResult.candidateName = candidate.name;
      newResult.categoryID = candidate.categoryID;
      newResult.instituteID = candidate.institute.id;
      newResult.programName = program.name;
      newResult.candidateProgram = candidateProgram;
      newResult.totalPoint =
        CreateFinalMarkDto.pointOne +
        CreateFinalMarkDto.pointTwo +
        CreateFinalMarkDto.pointThree;

      const arr = [
        CreateFinalMarkDto.pointOne,
        CreateFinalMarkDto.pointTwo,
        CreateFinalMarkDto.pointThree,
      ];
      const countJudges = arr.filter((item) => item > 0).length;
      newResult.percetage = (newResult.totalPoint / (countJudges * 100)) * 100;
      await this.FinalMarkRepo.save(newResult);
      return newResult;
    } catch (error) {
      throw error;
    }
  }

  findAllMarks() {
    return this.FinalMarkRepo.find({
      order: {
        totalPoint: 'DESC',
      },
    });
  }

  async createResult(createFinalResultDTO: CreateFinalResultDTO, id: number) {
    const candidateProgram = await this.CandidateProgramRepo.findOneBy({ id });
    if (!candidateProgram) throw new NotFoundException('Candidate not found');
    candidateProgram.position = createFinalResultDTO.position;
    candidateProgram.grade = createFinalResultDTO.grade;
    const postionPoint = await this.getPositionPoint(
      createFinalResultDTO.position,
      candidateProgram.programCode,
    );
    const gradePoint = await this.getGradePoint(
      createFinalResultDTO.grade,
      candidateProgram.programCode,
    );
    console.log(postionPoint, gradePoint);
    candidateProgram.point = postionPoint + gradePoint;
    await this.CandidateProgramRepo.save(candidateProgram);
    return candidateProgram;
  }

  getResult(id: number) {
    return this.CandidateProgramRepo.findOneBy({ id });
  }

  async getResultOfProgram(code: string) {
    const result = await this.CandidateProgramRepo.findOne({
      where: {
        programCode: code,
        program: {
          finalResultPublished: PublishingStatus.TRUE,
        },
        isSelected: SelectionStatus.TRUE,
        point: Between(1, 100),
      },
    });
    console.log(result);
    return result;
  }

  async getTotalOfInstitutions(queryParams: IProgramFilter) {
    const total = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .where('candidateProgram.sessionID = :sessionID', {
        sessionID: queryParams.sessionID,
      })
      .select('institute.id', 'instituteID')
      .addSelect('institute.name', 'instituteName')
      .addSelect('institute.shortName', 'instituteShortName')
      .addSelect('Sum(candidateProgram.point)', 'total')
      .groupBy('institute.id')
      .orderBy('total', 'DESC')
      .getRawMany();
    console.log(total);
    return total;
  }

  async getTotalOfInstitutionsByCategory(id: number) {
    const total = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .where('program.categoryID = :id', { id })
      .select('institute.id', 'instituteID')
      .addSelect('institute.name', 'instituteName')
      .addSelect('institute.shortName', 'instituteShortName')
      .addSelect('Sum(candidateProgram.point)', 'total')
      .groupBy('institute.id')
      .orderBy('total', 'DESC')
      .getRawMany();
    console.log(total);
    return total;
  }
  async getProgramsStutus(queryParams: IProgramFilter) {
    const status = await this.ProgramRepo.createQueryBuilder('program')
      .leftJoinAndSelect('program.session', 'session')
      .select('Count(program.id)', 'totalPublished')
      .where('session.id = :sessionID', { sessionID: queryParams.sessionID })
      .andWhere('program.finalResultPublished = :finalResultPublished', {
        finalResultPublished: PublishingStatus.TRUE,
      })
      .addSelect('Count(program.id)', 'totalEntered')
      .where('program.sessionID = :sessionID', {
        sessionID: queryParams.sessionID,
      })
      .andWhere('program.finalResultEntered = :finalResultEntered', {
        finalResultEntered: EnteringStatus.TRUE,
      })
      .getRawMany();
    console.log(status);
    return status;
  }

  async getPositionPoint(position: string, programCode: string) {
    const programData = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('program.category', 'category')
      .where('candidateProgram.programCode = :programCode', { programCode })
      .select('category.id')
      .addSelect('program.type')
      .getRawOne();
    console.log(programData);
    switch (programData.program_type) {
      case 'single':
        switch (position) {
          case 'First':
            return 5;
          case 'Second':
            return 3;
          case 'Third':
            return 1;
        }
      case 'group':
        switch (programData.category_id) {
          case 6 || 12:
            switch (position) {
              case 'First':
                return 10;
              case 'Second':
                return 7;
              case 'Third':
                return 5;
            }
          default:
            switch (position) {
              case 'First':
                return 7;
              case 'Second':
                return 5;
              case 'Third':
                return 3;
            }
        }
    }
  }
  async getGradePoint(grade: string, programCode: string) {
    const programData = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('program.category', 'category')
      .where('candidateProgram.programCode = :programCode', { programCode })
      .select('program.isStarred')
      .getRawOne();
    console.log(programData);
    switch (programData.program_is_starred) {
      case 'True':
        switch (grade) {
          case 'A':
            return 7;
          case 'B':
            return 5;
        }
      default:
        switch (grade) {
          case 'A':
            return 5;
          case 'B':
            return 3;
        }
    }
  }
}
