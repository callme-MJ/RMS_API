import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateProgramService } from 'src/candidate-program/candidate-program.service';
import {
  CandidateProgram,
  RoundStatus
} from 'src/candidate-program/entities/candidate-program.entity';
import { CandidateService } from 'src/candidate/services/candidate.service';
import {
  EnteringStatus,
  Program,
  PublishingStatus
} from 'src/program/entities/program.entity';
import { IProgramFilter, ProgramsService } from 'src/program/program.service';
import { Between, Repository } from 'typeorm';
import { CreateCodeLetterDto } from './dto/create-codeLetter.dto';
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

    candidateProgram.position = null;
    candidateProgram.point = candidateProgram.gradePoint;
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
        round: RoundStatus.Final,
        point: Between(1, 100),
      },
      order: {
        point: 'DESC',
      },
    });
    // console.log(result);
    return result;
  }

  async deleteResult(id: number) {
    const candidateProgram = await this.CandidateProgramRepo.findOneBy({ id });
    if (!candidateProgram) throw new NotFoundException('Candidate not found');
    candidateProgram.position = null;
    candidateProgram.point = candidateProgram.gradePoint;
    candidateProgram.postionPoint = null;
    await this.CandidateProgramRepo.save(candidateProgram);
  }

  async getTotalOfInstitutionsPublished(queryParams: IProgramFilter) {
    const total = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .leftJoinAndSelect('candidateProgram.session', 'session')
      .select('institute.id', 'instituteID')
      .addSelect('institute.name', 'instituteName')
      .addSelect('institute.shortName', 'instituteShortName')
      .addSelect('Sum(candidateProgram.point)', 'total')
      .addSelect('institute.coverPhoto', 'institutePhoto')
      .where('session.id = :sessionID', {
        sessionID: queryParams.sessionID,
      })
      .andWhere('program.finalResultPublished = :finalResultPublished', {
        finalResultPublished: PublishingStatus.TRUE,
      })
      .groupBy('institute.id')
      .orderBy('total', 'DESC')
      .getRawMany();
    // console.log(total.length);
    return total;
  }
  async getTotalOfInstitutionsPrivatePublished(queryParams: IProgramFilter) {
    const total = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .leftJoinAndSelect('candidateProgram.session', 'session')
      .select('institute.id', 'instituteID')
      .addSelect('institute.name', 'instituteName')
      .addSelect('institute.shortName', 'instituteShortName')
      .addSelect('Sum(candidateProgram.point)', 'total')
      .addSelect('institute.coverPhoto', 'institutePhoto')
      .where('session.id = :sessionID', {
        sessionID: queryParams.sessionID,
      })
      .andWhere('program.privatePublished = :privatePublished', {
        privatePublished: PublishingStatus.TRUE,
      })
      .groupBy('institute.id')
      .orderBy('total', 'DESC')
      .getRawMany();
    // console.log(total.length);
    return total;
  }
  async getTotalOfInstitutionsEntered(queryParams: IProgramFilter) {
    const total = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .leftJoinAndSelect('candidateProgram.session', 'session')
      .select('institute.id', 'instituteID')
      .addSelect('institute.name', 'instituteName')
      .addSelect('institute.shortName', 'instituteShortName')
      .addSelect('Sum(candidateProgram.point)', 'total')
      .addSelect('institute.coverPhoto', 'institutePhoto')
      .where('session.id = :sessionID', {
        sessionID: queryParams.sessionID,
      })
      .andWhere('program.finalResultEntered = :finalResultEntered', {
        finalResultEntered: EnteringStatus.TRUE,
      })
      .groupBy('institute.id')
      .orderBy('total', 'DESC')
      .getRawMany();
    // console.log(total.length);
    return total;
  }

  async getTotalOfInstitutionsByCategoryEntered(queryParams: IProgramFilter) {
    const total = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('program.category', 'category')
      .andWhere('program.finalResultEntered = :finalResultEntered', {
        finalResultEntered: PublishingStatus.TRUE,
      })
      .andWhere('candidateProgram.session.id = :sessionID', {
        sessionID: queryParams.sessionID,
      })
      .select('institute.id', 'instituteID')
      .addSelect('institute.name', 'instituteName')
      .addSelect('institute.shortName', 'instituteShortName')
      .addSelect('category.id', 'categoryID')
      .addSelect('category.name', 'categoryName')
      .addSelect('Sum(candidateProgram.point)', 'total')
      .groupBy('institute.id')
      .addGroupBy('program.categoryID')
      .orderBy('total', 'DESC')
      // .orderBy('institute.id', 'ASC')
      .getRawMany();
    // console.log(total.length);
    return total;
  }
  async getTotalOfInstitutionsCategoryPublished(id: number) {
    const total = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('program.category', 'category')
      .andWhere('program.finalResultPublished = :finalResultPublished', {
        finalResultPublished: PublishingStatus.TRUE,
      })
      .andWhere('program.category.id = :categoryID', {
        categoryID: id,
      })
      .select('institute.id', 'instituteID')
      .addSelect('institute.name', 'instituteName')
      .addSelect('institute.shortName', 'instituteShortName')
      .addSelect('category.id', 'categoryID')
      .addSelect('category.name', 'categoryName')
      .addSelect('Sum(candidateProgram.point)', 'total')
      .groupBy('institute.id')
      .orderBy('total', 'DESC')
      // .addOrderBy('institute.id', 'ASC')
      .getRawMany();
    // console.log(total.length);
    return total;
  }
  async getTotalOfInstitutionsCategoryPrivatePublished(id:number) {
    const total = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('program.category', 'category')
      .andWhere('program.privatePublished = :privatePublished', {
        privatePublished: PublishingStatus.TRUE,
      })
      .andWhere('program.category.id = :categoryID', {
        categoryID: id,
      })
      .select('institute.id', 'instituteID')
      .addSelect('institute.name', 'instituteName')
      .addSelect('institute.shortName', 'instituteShortName')
      .addSelect('category.id', 'categoryID')
      .addSelect('category.name', 'categoryName')
      .addSelect('Sum(candidateProgram.point)', 'total')
      .groupBy('institute.id')
      .orderBy('institute.id', 'ASC')
      .addOrderBy('total', 'DESC')
      .getRawMany();
    // console.log(total.length);
    return total;
  }
  async getTotalOfInstitutionsCategoryEntered(id: number) {
    const total = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('program.category', 'category')
      .andWhere('program.finalResultPublished = :finalResultEntered', {
        finalResultEntered: EnteringStatus.TRUE,
      })
      .andWhere('program.category.id = :categoryID', {
        categoryID: id,
      })
      .select('institute.id', 'instituteID')
      .addSelect('institute.name', 'instituteName')
      .addSelect('institute.shortName', 'instituteShortName')
      .addSelect('category.id', 'categoryID')
      .addSelect('category.name', 'categoryName')
      .addSelect('Sum(candidateProgram.point)', 'total')
      .groupBy('institute.id')
      .orderBy('total', 'DESC')
      // .orderBy('institute.id', 'ASC')
      .getRawMany();
    // console.log(total.length);
    return total;
  }

  async getTotalOfInstitutionsByCategoryPublished(queryParams: IProgramFilter) {
    const total = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('program.category', 'category')
      .andWhere('program.finalResultPublished = :finalResultPublished', {
        finalResultPublished: PublishingStatus.TRUE,
      })
      .andWhere('candidateProgram.session.id = :sessionID', {
        sessionID: queryParams.sessionID,
      })
      .select('institute.id', 'instituteID')
      .addSelect('institute.name', 'instituteName')
      .addSelect('institute.shortName', 'instituteShortName')
      .addSelect('category.id', 'categoryID')
      .addSelect('category.name', 'categoryName')
      .addSelect('Sum(candidateProgram.point)', 'total')
      .groupBy('institute.id')
      .addGroupBy('program.categoryID')
      // .orderBy("institute.id", "ASC")
      .addOrderBy('total', 'DESC')
      .getRawMany();
    // console.log(total.length);
    return total;
  }
  async getTotalOfInstitutionsByCategoryPrivatePublished(queryParams: IProgramFilter) {
    const total = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('program.category', 'category')
      .andWhere('program.privatePublished = :privatePublished', {
        privatePublished: PublishingStatus.TRUE,
      })
      .andWhere('candidateProgram.session.id = :sessionID', {
        sessionID: queryParams.sessionID,
      })
      .select('institute.id', 'instituteID')
      .addSelect('institute.name', 'instituteName')
      .addSelect('institute.shortName', 'instituteShortName')
      .addSelect('category.id', 'categoryID')
      .addSelect('category.name', 'categoryName')
      .addSelect('Sum(candidateProgram.point)', 'total')
      .groupBy('institute.id')
      .addGroupBy('program.categoryID')
      // .orderBy("institute.id", "ASC")
      .addOrderBy('total', 'DESC')
      .getRawMany();
    // console.log(total.length);
    return total;
  }
  async getProgramStutusPublished(queryParams: IProgramFilter) {
    const status = await this.ProgramRepo.createQueryBuilder('program')
      .leftJoinAndSelect('program.category', 'category')
      .leftJoinAndSelect('program.session', 'session')
      .select('Count(program.id)', 'totalProgramPublished')
      .addSelect('session.id', 'sessionID')
      .addSelect('session.name', 'sessionName')
      .where('program.finalResultPublished = :finalResultPublished', {
        finalResultPublished: PublishingStatus.TRUE,
      })
      // .andWhere('session.id = :sessionID', {
      //   sessionID: queryParams.sessionID,
      // })
      .groupBy('session.id')
      // .addGroupBy('category.id')
      .getRawMany();
    // console.log(status.length);
    return status;
  }
  async getProgramStatusprivatePublished(queryParams: IProgramFilter) {
    const status = await this.ProgramRepo.createQueryBuilder('program')
      .leftJoinAndSelect('program.category', 'category')
      .leftJoinAndSelect('program.session', 'session')
      .select('Count(program.id)', 'totalProgramPublished')
      .addSelect('session.id', 'sessionID')
      .addSelect('session.name', 'sessionName')
      .where('program.privatePublished = :privatePublished', {
        privatePublished: PublishingStatus.TRUE,
      })
      // .andWhere('session.id = :sessionID', {
      //   sessionID: queryParams.sessionID,
      // })
      .groupBy('session.id')
      // .addGroupBy('category.id')
      .getRawMany();
    // console.log(status.length);
    return status;
  }
  async getProgramStatusEntered(queryParams: IProgramFilter) {
    const status = await this.ProgramRepo.createQueryBuilder('program')
      .leftJoinAndSelect('program.category', 'category')
      .leftJoinAndSelect('program.session', 'session')
      .select('session.name', 'sessionName')
      .addSelect('Count(program.id)', 'totalProgramPublished')
      .where('program.finalResultEntered = :finalResultEntered', {
        finalResultEntered: EnteringStatus.TRUE,
      })
      .andWhere('session.id = :sessionID', {
        sessionID: queryParams.sessionID,
      })
      .addSelect('category.name', 'categoryName')
      .groupBy('session.id')
      .addGroupBy('category.id')
      .getRawMany();
    // console.log(status.length);
    return status;
  }
  async getResultsOfInstitute(id: number) {
    const results = await this.CandidateProgramRepo.find({
      where: {
        institute: {
          id: id,
        },
        point: Between(1, 100),
        program: {
          finalResultPublished: PublishingStatus.TRUE,
        },
      },
      order: {
        program: {
          updatedAt: 'DESC',
        },
      },
    });
    // console.log(results.length);
    return results;
  }

  
  async getToppers() {
    const query = await this.CandidateProgramRepo.createQueryBuilder("candidateProgram")
    .leftJoinAndSelect("candidateProgram.candidate", "candidate")
    .leftJoinAndSelect("candidateProgram.program", "program")
    .leftJoinAndSelect("candidateProgram.session", "session")
    .leftJoinAndSelect("candidate.category", "category")
    .leftJoinAndSelect("candidate.institute", "institute")
    .where("program.finalResultPublished = :finalResultPublished", {
      finalResultPublished: PublishingStatus.TRUE,
      })
    .andWhere("program.type = :type", {
      type: "single",
      })
    .select("candidate.category_id, candidateProgram.chestNO ,institute.short_name ,candidate.name as candidateName,candidate.photo ,category.name as categoryName,session.name as sessionName , session.id " )
    .addSelect("SUM(candidateProgram.point)", "score")
    .groupBy("candidate.category_id, candidateProgram.chestNO")
    .orderBy("score", "DESC")
    .getRawMany()

    const toppers = query.reduce((acc, item) => {
      if (!acc[item.category_id]) {
        acc[item.category_id] = item;
      }
      return acc;
    }, {});
    return Object.values(toppers);
  }
  
  async getResultOfAllPrograms() {

    const programs = await this.ProgramRepo.createQueryBuilder("program")
    .leftJoinAndSelect("program.category", "category")
    .leftJoinAndSelect("program.session", "session")
    .select('program.id', 'programID')
    .addSelect('program.name', 'programName')
    .addSelect('program.programCode', 'programCode')
    .addSelect("program.updatedAt", "updatedAt")
    .addSelect('category.name', 'categoryName')
    .orderBy("program.updatedAt", "DESC")
    .getRawMany()
    console.log(programs);
    
    const results = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
    )
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .leftJoinAndSelect('candidateProgram.candidate', 'candidate')
      .leftJoinAndSelect('candidate.category', 'category')
      .select('program.id', 'id')
      .addSelect('candidate.name', 'candidateName')
      .addSelect('candidate.chestNO', 'chestNO')
      .addSelect('program.name', 'programName')
      .addSelect('program.programCode', 'programCode')
      .addSelect('candidateProgram.point', 'point')
      .addSelect('candidateProgram.position', 'position')
      .addSelect('candidateProgram.grade', 'grade')
      .addSelect('candidate.photo', 'photo')
      // .addSelect('candidateProgram.updatedAt', 'updatedAt')
      .addSelect('institute.shortName', 'instituteShortName')
      .where('program.finalResultPublished = :finalResultPublished', {finalResultPublished: PublishingStatus.TRUE})
      .andWhere('candidateProgram.point > :point', { point: 0 })
      .orderBy('program.updatedAt', 'DESC')
      .addOrderBy('program.id', 'ASC')
      .addOrderBy('candidateProgram.point', 'DESC')
      // .groupBy("program.id")
      .getRawMany();
    const programResults = programs.map((program) => {
      const programResult = results.filter(
        (result) => result.programCode === program.programCode,
      );
      return {
        ...program,
        programResult,
      };
    });
    
    return programResults;
  }
  async publishResultOfFinal(programCode: string) {
    try {
      const program = await this.programService.findOneByProgramCode(
        programCode,
      );
      if (!program) throw new NotFoundException('Program not found');
      if (program.finalResultEntered != EnteringStatus.TRUE)
      throw new NotFoundException('Result not entered completely');
      if (program.privatePublished != EnteringStatus.TRUE)
      throw new NotFoundException('Result not published');
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
  async submitCodeLetter(code:string){
    const program = await this.programService.findOneByProgramCode(code);
    if(!program) throw new NotFoundException('Program not found');
    program.codeLetterSubmitted = EnteringStatus.TRUE;
    await this.programService.update(program.id,program);
    return program;
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
  async privatePublishResultOfFinal(programCode: string) {
    try {
      const program = await this.programService.findOneByProgramCode(
        programCode,
      );
      if (!program) throw new NotFoundException('Program not found');
      if (program.finalResultEntered != EnteringStatus.TRUE)
        throw new NotFoundException('Result not entered completely');
      program.privatePublished = PublishingStatus.TRUE;
      await this.programService.update(program.id, program);
      return program;
    } catch (error) {
      throw error;
    }
  }

  async privateUnPublishResultOfFinal(programCode: string) {
    try {
      const program = await this.programService.findOneByProgramCode(
        programCode,
      );
      if (!program) throw new NotFoundException('Program not found');
      if(program.finalResultPublished == PublishingStatus.TRUE) throw new NotFoundException('Result has been announced');
      program.privatePublished = PublishingStatus.FALSE;
      await this.programService.update(program.id, program);
      return program;
    } catch (error) {
      throw error;
    }
  }

  async getPrivatePublishedPrograms(queryParams: IProgramFilter) {
    return await this.ProgramRepo.find({
      where: {
        privatePublished: PublishingStatus.TRUE,
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
        session: {
          id: queryParams.sessionID,
        },
      },
      order: {
        updatedAt: 'DESC',
      },
    });
  }
  async getAllPrograms(queryParams: IProgramFilter) {
    return await this.ProgramRepo.find({
      where: {
        sessionID: queryParams.sessionID,
      },
    });
  }
  
  
  async getOverview(queryParams: IProgramFilter) {
    const overview = await this.CandidateProgramRepo.createQueryBuilder(
      'candidateProgram',
      )
      .leftJoinAndSelect('candidateProgram.program', 'program')
      .leftJoinAndSelect('candidateProgram.institute', 'institute')
      .leftJoinAndSelect('candidateProgram.candidate', 'candidate')
      .leftJoinAndSelect('program.category', 'category')
      .where('candidateProgram.round =  :round', { round: RoundStatus.Final })
      .andWhere('program.sessionID = :sessionID', {
        sessionID: queryParams.sessionID,
      })
      .select('candidate.name', 'candidateName')
      .addSelect('candidate.chestNO', 'chestNO')
      .addSelect('program.name', 'programName')
      .addSelect('program.programCode', 'programCode')
      .addSelect('institute.shortName', 'instituteShortName')
      .addSelect('category.name', 'categoryName')
      .addSelect('candidateProgram.position', 'postion')
      .addSelect('candidateProgram.grade', 'grade')
      .addSelect('candidateProgram.point', 'point')
      .addSelect('program.finalResultEntered', 'finalResultEntered')
      .addSelect('program.finalResultPublished', 'finalResultPublished')
      .addSelect("program.private_published","private-published")
      .getRawMany();
      console.log(overview.length);
      return overview;
    }
    // async getScoreCard(){
    //   const total = await this.CandidateProgramRepo.createQueryBuilder('candidateProgram')
    //   .leftJoinAndSelect('candidateProgram.session', 'session')
    //   .leftJoinAndSelect('candidateProgram.institute', 'institute') 
    //   .select("session.id", "sessionID")
    //   .addSelect("session.name", "sessionName")
    //   .addSelect("institute.shortName", "insituteShortName")
  
  
    // }
    
  async getScoreCard(){
    const instituteWiseTotal = await this.CandidateProgramRepo.createQueryBuilder('candidateProgram')
    .leftJoinAndSelect('candidateProgram.session', 'session')
    .leftJoinAndSelect('candidateProgram.institute', 'institute') 
    .select("session.id", "sessionID")
    .addSelect("session.name", "sessionName")
    .addSelect("institute.shortName", "insituteShortName")
    .addSelect("institute.id", "insituteID")
    .addSelect("SUM(candidateProgram.point)", "totalPoint")
    .groupBy("institute.id")
    .orderBy("totalPoint","DESC")
    .getRawMany()
    // console.log();
    


    const categoryWiseTotal = await this.CandidateProgramRepo.createQueryBuilder('candidateProgram')
    .leftJoinAndSelect('candidateProgram.program', 'program')
    .leftJoinAndSelect('candidateProgram.institute', 'institute')
    .leftJoinAndSelect('program.category', 'category')
    .select("category.id", "categoryID")
    .addSelect("category.name", "categoryName")
    .addSelect('institute.id', 'instituteID')
    .addSelect("SUM(candidateProgram.point)", "totalPoint")
    .groupBy("category.id")
    .addGroupBy("institute.id")
    .getRawMany()
    console.log(categoryWiseTotal);

    const scoreCard= instituteWiseTotal.map((institute)=>{
      const categoryTotal = categoryWiseTotal.filter((category)=>category.instituteID == institute.insituteID)
      return {
        sessionID: institute.sessionID,
        sessionName: institute.sessionName,
        instituteShortName: institute.insituteShortName,
        totalPoint: institute.totalPoint,
        categoryTotal
      }
    })


    return {scoreCard}
    
  }
  async addCodeLetter(createCodeLetterDto: CreateCodeLetterDto) {
    try {
      const candidate_program = await this.CandidateProgramRepo.findOne({
        where: {
          programCode: createCodeLetterDto.programCode,
          chestNO: createCodeLetterDto.chestNO,
        },
      });
      candidate_program.codeLetter = createCodeLetterDto.codeLetter;
      await this.candidateProgramService.update(
        candidate_program.id,
        candidate_program,
      );
      return candidate_program;
    } catch (error) {
      throw error;
    }
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
    // console.log(programData);
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
    // console.log(programData);
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
      case percetage >= 65 && percetage <= 79.9:
        return 'B';
    }
  }
}
