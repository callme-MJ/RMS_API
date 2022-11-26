import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateProgramService } from 'src/candidate-program/candidate-program.service';
import {
  CandidateProgram,
  SelectionStatus,
} from 'src/candidate-program/entities/candidate-program.entity';
import { CandidateService } from 'src/candidate/services/candidate.service';
import {
  EnteringStatus,
  Program,
  PublishingStatus,
} from 'src/program/entities/program.entity';
import { IProgramFilter, ProgramsService } from 'src/program/program.service';
import { Between, Repository } from 'typeorm';
import { CreateFinalMarkDto } from './dto/create-final-mark.dto';
import { CreateFinalResultDTO } from './dto/create-final-result.dto';
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
    private readonly programService: ProgramsService,
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
      const program = await this.programService.findOneByProgramCode(
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
      newResult.percentage = (newResult.totalPoint / (countJudges * 100)) * 100;
      await this.FinalMarkRepo.save(newResult);
      candidateProgram.grade = await this.getGrade(newResult.percentage);
      const gradePoint = await this.getGradePoint(
        candidateProgram.grade,
        candidateProgram.programCode,
      );
      candidateProgram.gradePoint = gradePoint;
      candidateProgram.point = gradePoint;
      await this.CandidateProgramRepo.save(candidateProgram);
      return newResult;
    } catch (error) {
      throw error;
    }
  }
  async DeleteMarks(id: number) {
    const FinalMark = await this.FinalMarkRepo.findOneBy({
      id,
    });
    const candidateProgram = await this.CandidateProgramRepo.findOneBy({
      id: FinalMark.candidateProgram.id,
    });
    candidateProgram.position = null;
    candidateProgram.grade = null;
    candidateProgram.gradePoint = null;
    candidateProgram.postionPoint = null;
    candidateProgram.point = null;
    await this.CandidateProgramRepo.save(candidateProgram);
    if (!FinalMark) throw new NotFoundException('Mark not found');
    await this.FinalMarkRepo.delete({ id });
  }

  findAllMarks() {
    return this.FinalMarkRepo.find({
      order: {
        totalPoint: 'DESC',
      },
    });
  }
  findAllMarksOfProgram(code: string) {
    return this.FinalMarkRepo.find({
      where: {
        programCode: code,
      },
      order: {
        totalPoint: 'DESC',
      },
    });
  }

  async createResult(createFinalResultDTO: CreateFinalResultDTO, id: number) {
    const candidateProgram = await this.CandidateProgramRepo.findOneBy({ id });
    if (!candidateProgram) throw new NotFoundException('Candidate not found');
    candidateProgram.position = createFinalResultDTO.position;

    const postionPoint = await this.getPositionPoint(
      createFinalResultDTO.position,
      candidateProgram.programCode,
    );
    candidateProgram.postionPoint = postionPoint;

    candidateProgram.point = postionPoint + candidateProgram.point;
    await this.CandidateProgramRepo.save(candidateProgram);
    return candidateProgram;
  }
  async submitResult(id: number) {
    const program = await this.ProgramRepo.findOneBy({ id });
    if (!program) throw new NotFoundException('Program not found');
    program.finalResultEntered = EnteringStatus.TRUE;
    await this.ProgramRepo.save(program);
    return program;
  }

  async unsubmitResult(id: number) {
    const program = await this.ProgramRepo.findOneBy({ id });
    if (!program) throw new NotFoundException('Program not found');
    program.finalResultEntered = EnteringStatus.FALSE;
    await this.ProgramRepo.save(program);
    return program;
  }

  getResult(id: number) {
    return this.CandidateProgramRepo.findOneBy({ id });
  }

  async getResultOfProgram(code: string) {
    const result = await this.CandidateProgramRepo.find({
      where: {
        programCode: code,
        program: {
          finalResultPublished: PublishingStatus.TRUE,
        },
        isSelected: SelectionStatus.TRUE,
        point: Between(1, 100),
      },
      order: {
        point: 'DESC',
      },
    });
    console.log(result);
    return result;
  }

  async deleteResult(id: number) {
    const candidateProgram = await this.CandidateProgramRepo.findOneBy({ id });
    if (!candidateProgram) throw new NotFoundException('Candidate not found');
    candidateProgram.position = null;
    candidateProgram.point = candidateProgram.gradePoint;
    candidateProgram.postionPoint= null;
    await this.CandidateProgramRepo.save(candidateProgram);
  }
  async getTotalOfInstitutionsPublished(queryParams: IProgramFilter) {
    const total = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .where('candidateProgram.sessionID = :sessionID', {
        sessionID: queryParams.sessionID,
      })
      .andWhere('program.finalResultPublished :finalResultPublished', {
        finalResultPublished: PublishingStatus.TRUE,
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
  async getTotalOfInstitutionsEntered(queryParams: IProgramFilter) {
    const total = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .where('candidateProgram.sessionID = :sessionID', {
        sessionID: queryParams.sessionID,
      })
      .andWhere('program.finalResultPublished :finalResultEntered', {
        finalResultEntered: PublishingStatus.TRUE,
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

  async getTotalOfInstitutionsByCategoryEntered(id: number) {
    const total = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .where('program.categoryID = :id', { id })
      .andWhere('program.finalResultPublished :finalResultEntered', {
        finalResultEntered: PublishingStatus.TRUE,
      })
      .select('institute.id', 'instituteID')
      .addSelect('institute.name', 'instituteName')
      .addSelect('institute.shortName', 'instituteShortName')
      .addSelect('Sum(candidateProgram.point)', 'total')
      .groupBy('institute.id')
      .addGroupBy('program.categoryID')
      .orderBy('total', 'DESC')
      .getRawMany();
    console.log(total);
    return total;
  }
  async getTotalOfInstitutionsByCategoryPublished(id: number) {
    const total = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .where('program.categoryID = :id', { id })
      .andWhere('program.finalResultPublished = :finalResultPublished', {
        finalResultPublished: PublishingStatus.TRUE,
      })
      .select('institute.id', 'instituteID')
      .addSelect('institute.name', 'instituteName')
      .addSelect('institute.shortName', 'instituteShortName')
      .addSelect('Sum(candidateProgram.point)', 'total')
      .groupBy('institute.id')
      .addGroupBy('program.categoryID')
      .orderBy('total', 'DESC')
      .getRawMany();
    console.log(total);
    return total;
  }
  async getProgramsStutus() {
    const status = await this.ProgramRepo.createQueryBuilder('program')
      .leftJoinAndSelect('program.session', 'session')
      .select('session.name', 'sessionName')
      .addSelect('Count(program.id)', 'totalPublished')
      .where('program.finalResultPublished = :finalResultPublished', {
        finalResultPublished: PublishingStatus.TRUE,
      })
      // .addSelect('Count(program.id)', 'totalEntered')
      // .where('program.finalResultEntered = :finalResultEntered', {
      //   finalResultEntered: EnteringStatus.TRUE,
      // })
      .groupBy('session.id')
      .getRawMany();
    console.log(status);
    return status;
  }

  async getToppers() {
    const toppers = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .leftJoinAndSelect('candidateProgram.candidate', 'candidate')
      .leftJoinAndSelect('program.category', 'category')
      .leftJoinAndSelect('program.session', 'session')
      .select('candidate.name', 'candidateName')
      .addSelect('candidate.chestNO', 'chestNO')
      .addSelect('MAX(candidateProgram.point)', 'score')
      .addSelect('institute.shortName', 'instituteShortName')
      .addSelect('category.name', 'categoryName')
      .addSelect('session.name', 'sessionName')
      .where('program.type = :type', { type: 'single' })
      .groupBy('category.id')
      .getRawMany();
    return toppers;
  }
  async publishResultOfFinal(programCode: string) {
    try {
      const program = await this.programService.findOneByProgramCode(
        programCode,
      );
      if (!program) throw new NotFoundException('Program not found');
      if (program.finalResultEntered != EnteringStatus.TRUE)
        throw new NotFoundException('Result not entered completely');
      program.finalResultPublished = PublishingStatus.TRUE;
      await this.programService.update(program.id, program);
      return program;
    } catch (error) {
      throw error;
    }
  }

  async unPublishResultOfFinal(programCode: string) {
    try {
      const program = await this.programService.findOneByProgramCode(
        programCode,
      );
      if (!program) throw new NotFoundException('Program not found');
      program.finalResultPublished = PublishingStatus.FALSE;
      await this.programService.update(program.id, program);
      return program;
    } catch (error) {
      throw error;
    }
  }

  async getPublishedPrograms(queryParams: IProgramFilter) {
    return await this.ProgramRepo.find({
      where: {
        finalResultPublished: PublishingStatus.TRUE,
        sessionID: queryParams.sessionID,
      },
      order: {
        updatedAt: 'DESC',
      },
    });
  }
  async getEnteredPrograms(queryParams: IProgramFilter) {
    return await this.ProgramRepo.find({
      where: {
        finalResultEntered: EnteringStatus.TRUE,
        session:{
          id:queryParams.sessionID
        }
      },
      order: {
        updatedAt: 'DESC',
      },
    });
  }
  async getAllPrograms(queryParams:IProgramFilter) {
    return await this.ProgramRepo.find({
      where: {
        sessionID: queryParams.sessionID,
      },
    });
  }
  async getOverview(queryParams: IProgramFilter) {
    const overview = await this.CandidateProgramRepo.createQueryBuilder('candidateProgram')
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('program.session', 'session')
      .select('session.name', 'sessionName')
      .addSelect("candidateProgram.programCode", "programCode")
      .addSelect("program.name", "programName")
      .getRawMany();
    return overview;
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
          case 'None':
            return 0;
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
              case 'None':
                return 0;
            }
          default:
            switch (position) {
              case 'First':
                return 7;
              case 'Second':
                return 5;
              case 'Third':
                return 3;
              case 'None':
                return 0;
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
          default:
            return 0;
        }
      default:
        switch (grade) {
          case 'A':
            return 5;
          case 'B':
            return 3;
          default:
            return 0;
        }
    }
  }
  async getGrade(percetage: number) {
    switch (true) {
      case percetage >= 80 && percetage <= 100:
        return 'A';
      case percetage >= 65 && percetage <= 79:
        return 'B';
    }
  }
}
