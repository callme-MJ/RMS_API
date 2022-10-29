import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { IFilter } from 'src/candidate/interfaces/filter.interface';
import { CandidateService } from 'src/candidate/services/candidate.service';
import { CoordinatorService } from 'src/coordinator/services/coordinator.service';
import { Program } from 'src/program/entities/program.entity';
import { ProgramsService } from 'src/program/program.service';
import { SessionStatus } from 'src/session/entities/session.entity';
import { Repository } from 'typeorm';
import { CreateCandidateProgramDTO } from './dto/create-candidate-program.dto';
import { UpdateCandidateProgramDTO } from './dto/update-candidate-program.dto';
import { CandidateProgram } from './entities/candidate-program.entity';
export interface ICandidateProgramFIilter extends IFilter {
  candidateID: number;
  instituteID: number;
  sessionID: number;
}
export interface ICandidateFIilter extends IFilter {
  instituteID: number;
}
@Injectable()
export class CandidateProgramService {
  constructor(
    @InjectRepository(CandidateProgram)
    private readonly candidateProgramRepository: Repository<CandidateProgram>,
    private readonly candidateService: CandidateService,
    private readonly coordinatorService: CoordinatorService,
    private readonly programsService: ProgramsService,
  ) { }
  public async create(createCandidateProgramDTO: CreateCandidateProgramDTO) {
    try {
      const candidate: Candidate =
        await this.candidateService.findCandidateBychestNO(
          createCandidateProgramDTO.chestNO,
        );
      const program: Program = await this.programsService.findOneByProgramCode(
        createCandidateProgramDTO.programCode,
      );

      if (!candidate)
        throw new NotFoundException('Candidate not found');
      const newCandidateProgram: CandidateProgram =
        await this.candidateProgramRepository.create(createCandidateProgramDTO);
      newCandidateProgram.candidate = candidate;
      newCandidateProgram.program = program;
      await this.candidateProgramRepository.save(newCandidateProgram);
      await this.checkEligibility(newCandidateProgram);
      return newCandidateProgram;
    } catch (error) {
      throw error;
    }
  }

  public async findAll(queryParams: ICandidateProgramFIilter): Promise<CandidateProgram[]> {
    const candidateprogramsQuery = this.candidateProgramRepository.createQueryBuilder(
      'candidates',
    );

    const search = queryParams.search;
    const sort = queryParams.sort;
    const page = queryParams.page || 1;

    if (search) {
      candidateprogramsQuery.where(
        'name LIKE :search OR chestNO LIKE :search',
        { search: `%${search}%` },
      );
    };
    if (sort) {
      candidateprogramsQuery.orderBy('candidates.name', sort).getMany();
    }

    const perPage = 10;
    candidateprogramsQuery.offset((page - 1) * perPage).limit(perPage);
    try {
      let candidatePrograms = await this.candidateProgramRepository.find({
        where: {
          candidate: {
            session: {
              id: queryParams.sessionID,
              status: SessionStatus.ACTIVE
            }
          }
        }
      })

      return candidatePrograms;
    } catch (error) {
      throw error;
    }


  }

  public async findAllCandidateProgramsOfInstitute(id: number, queryParams: ICandidateFIilter): Promise<CandidateProgram[]> {
    const loggedInCoordinator = await this.coordinatorService.findOne(id);
    let candidatePrograms = await this.candidateProgramRepository.createQueryBuilder('candidatePrograms')
      .leftJoinAndSelect('candidatePrograms.candidate', 'candidate')
      .where('candidate.institute.id = :instituteId', { instituteId: loggedInCoordinator.institute.id })
      .getMany()

    return candidatePrograms;
  }

  public async findOne(id: number) {
    try {
      let candidateProgram = await this.candidateProgramRepository.findOneBy({
        id,
      });
      if (!candidateProgram)
        throw new NotFoundException(
          'Candidate has not applied for this program',
        );
      return candidateProgram;
    } catch (error) { }
  }

  public async update(
    id: number,
    updateCandidateProgramDto: UpdateCandidateProgramDTO,
  ) {
    let candidateProgram = await this.candidateProgramRepository.findOneBy({
      id,
    });
    if (!candidateProgram)
      throw new NotFoundException('Candidate has not applied for this program');


    let newCandidateProgram = await this.candidateProgramRepository.update(id, updateCandidateProgramDto);
    return newCandidateProgram;
  }

  public async remove(id: number) {
    return this.candidateProgramRepository.delete(id);
  }

  public async checkEligibility(newCandidateProgram): Promise<boolean> {
    try {
      const { chestNO, programCode } = newCandidateProgram;
      // const sessionID = newCandidateProgram.program.sessionID;
      // console.log(sessionID);

      const candidateProgram = await this.candidateProgramRepository
        .createQueryBuilder('candidateProgram')
        .leftJoinAndSelect('candidateProgram.candidate', 'candidate')
        .leftJoinAndSelect('candidateProgram.program', 'program')
        .leftJoinAndSelect('program.category', 'category')
        .leftJoinAndSelect('candidate.institute', 'institute')
        .leftJoinAndSelect('institute.session', 'session');

      const instituteID = await candidateProgram
        .where('candidate.chestNO = :chestNO', { chestNO })
        //.andWhere('session.id = :sessionID', { sessionID })
        .select('institute.id')
        .getRawOne();

      const duplicateSingle = await candidateProgram
        .where('institute.id = :instituteID', {
          instituteID,
        })
        .andWhere('program.programCode = :programCode', {
          programCode,
        })
        .andWhere('program.type = :type', {
          type: 'single',
        })
        //.andWhere('session.id = :sessionID', { sessionID })
        .select('candidateProgram.id')
        .getCount();
      const duplicateGroup = await candidateProgram
        .where('institute.id = :instituteID', {
          instituteID,
        })
        .andWhere('program.programCode = :programCode', {
          programCode,
        })
        .andWhere('program.type = :type', {
          type: 'group',
        })
        //.andWhere('session.id = :sessionID', { sessionID })
        .select('candidateProgram.id')
        .getCount();
      const groupCountData = await candidateProgram
        .where('program.programCode = :programCode', {
          programCode,
        })
        .select('program.group_count')
        .getRawOne();
      console.log("hi1");

      let result3 = Object.values(JSON.parse(JSON.stringify(groupCountData)));
      let groupCount = result3[0];

      if (duplicateSingle > 1 || duplicateGroup > groupCount) {
        await this.candidateProgramRepository.delete(newCandidateProgram.id);
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
        //.andWhere('session.id = :sessionID', { sessionID })
        .select('candidateProgram.id')
        .getCount();
      if (single > 6) {
        await this.candidateProgramRepository.delete(newCandidateProgram.id);
        throw new NotFoundException(
          'Candidate already enrolled in 6 single program',
        );
      }

      let stage = await candidateProgram
        .where('candidate.chestNO = :chestNO', {
          chestNO,
        })
        .andWhere('program.type = :type', {
          type: 'single',
        })
        .andWhere('program.mode = :mode', {
          mode: 'stage',
        })
        //.andWhere('session.id = :sessionID', { sessionID })
        .select('candidateProgram.id')
        .getCount();

      if (stage > 4) {
        await this.candidateProgramRepository.delete(newCandidateProgram.id);
        throw new NotFoundException(
          'Candidate already enrolled in 4 stage program',
        );
      }

      let nonStage = single - stage;
      if (nonStage > 4) {
        await this.candidateProgramRepository.delete(newCandidateProgram.id);
        throw new NotFoundException(
          'Candidate already enrolled in 4 non-stage program',
        );
      }

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
        //.andWhere('session.id = :sessionID', { sessionID })
        .select('candidateProgram.id')
        .getCount();

      let maxCurbGroupData = await candidateProgram
        .where('program.program_code = :programCode', {
          programCode,
        })
        .select('program.max_count_curb')
        .getRawOne();

      let result1 = Object.values(JSON.parse(JSON.stringify(maxCurbGroupData)));
      let maxCurbGroup = result1[0];

      if (countCurbGroup > maxCurbGroup) {
        await this.candidateProgramRepository.delete(newCandidateProgram.id);
        throw new NotFoundException(
          'Candidate already enrolled in maximum number of a curb group',
        );
      }

      let languageGroupData = await candidateProgram
        .where('program.program_code = :programCode', {
          programCode,
        })
        //.andWhere('session.id = :sessionID', { sessionID })
        .select('program.language_group')
        .getRawOne();

      let result2 = Object.values(
        JSON.parse(JSON.stringify(languageGroupData)),
      );
      let languageGroup = result2[0];

      let countLanguageGroup = await candidateProgram
        .where('candidate.chestNO = :chestNO', {
          chestNO,
        })
        .andWhere('program.language_group = :languageGroup', {
          languageGroup,
        })
        .select('candidateProgram.id')
        .getCount();

      if (countLanguageGroup > 1) {
        await this.candidateProgramRepository.delete(newCandidateProgram.id);
        throw new NotFoundException(
          'Candidate already enrolled in maximum number of a language group',
        );
      }
      return true;
    } catch (error) {
      throw error;
    }
  }




  // public async checkEligibility(newCandidateProgram): Promise<boolean> {
  //   try {
  //     const { chestNO, programCode } = newCandidateProgram;
  //     // const sessionID = newCandidateProgram.program.sessionID;
  //     const candidateProgram = await this.candidateProgramRepository
  //       .createQueryBuilder('candidateProgram')
  //       .leftJoinAndSelect('candidateProgram.candidate', 'candidate')
  //       .leftJoinAndSelect('candidateProgram.program', 'program')
  //       .leftJoinAndSelect('program.category', 'category')
  //       .leftJoinAndSelect('candidate.institute', 'institute')
  //       .leftJoinAndSelect('institute.session', 'session');
  //     const instituteID = await candidateProgram
  //       .where('candidate.chestNO = :chestNO', { chestNO })
  //       // .andWhere('session.id = :sessionID', { sessionID })
  //       .select('institute.id')
  //       .getRawOne();


  //     const duplicateSingle = await candidateProgram
  //       .where('institute.id = :instituteID', {
  //         instituteID,
  //       })
  //       .andWhere('program.programCode = :programCode', {
  //         programCode,
  //       })
  //       .andWhere('program.type = :type', {
  //         type: 'single',
  //       })
  //       // .andWhere('session.id = :sessionID', { sessionID })
  //       .select('candidateProgram.id')
  //       .getCount();
  //     console.log("2")
  //     const duplicateGroup = await candidateProgram
  //       .where('institute.id = :instituteID', {
  //         instituteID,
  //       })
  //       .andWhere('program.programCode = :programCode', {
  //         programCode,
  //       })
  //       .andWhere('program.type = :type', {
  //         type: 'group',
  //       })
  //       // .andWhere('session.id = :sessionID', { sessionID })
  //       .select('candidateProgram.id')
  //       .getCount();
  //     const groupCountData = await candidateProgram
  //       .where('program.programCode = :programCode', {
  //         programCode,
  //       })
  //       .select('program.group_count')
  //       .getRawOne();
  //     let result3 = Object.values(JSON.parse(JSON.stringify(groupCountData)));
  //     let groupCount = result3[0];
  //     console.log("3")
  //     if (duplicateSingle > 1 || duplicateGroup > groupCount) {
  //       await this.candidateProgramRepository.delete(newCandidateProgram.id);
  //       throw new NotFoundException(
  //         'Institute already enrolled in this program',
  //       );
  //     }
  //     console.log("4")
  //     let single = await candidateProgram
  //       .where('candidate.chestNO = :chestNO', {
  //         chestNO,
  //       })
  //       .andWhere('program.type = :type', {
  //         type: 'single',
  //       })
  //       // .andWhere('session.id = :sessionID', { sessionID })
  //       .select('candidateProgram.id')
  //       .getCount();
  //     if (single > 6) {
  //       await this.candidateProgramRepository.delete(newCandidateProgram.id);
  //       throw new NotFoundException(
  //         'Candidate already enrolled in 6 single program',
  //       );
  //     }
  //     console.log("5")
  //     let stage = await candidateProgram
  //       .where('candidate.chestNO = :chestNO', {
  //         chestNO,
  //       })
  //       .andWhere('program.type = :type', {
  //         type: 'single',
  //       })
  //       .andWhere('program.mode = :mode', {
  //         mode: 'stage',
  //       })
  //       // .andWhere('session.id = :sessionID', { sessionID })
  //       .select('candidateProgram.id')
  //       .getCount();
  //     console.log("6")
  //     if (stage > 4) {
  //       await this.candidateProgramRepository.delete(newCandidateProgram.id);
  //       throw new NotFoundException(
  //         'Candidate already enrolled in 4 stage program',
  //       );
  //     }

  //     let nonStage = single - stage;
  //     if (nonStage > 4) {
  //       await this.candidateProgramRepository.delete(newCandidateProgram.id);
  //       throw new NotFoundException(
  //         'Candidate already enrolled in 4 non-stage program',
  //       );
  //     }

  //     let curbGroupData = await candidateProgram
  //       .where('program.program_code = :programCode', {
  //         programCode,
  //       })
  //       // .andWhere('session.id = :sessionID', { sessionID })
  //       .select('program.curb_group')
  //       .getRawOne();
  //     let result = Object.values(JSON.parse(JSON.stringify(curbGroupData)));
  //     let curbGroup = result[0];

  //     let countCurbGroup = await candidateProgram
  //       .where('candidate.chestNO = :chestNO', {
  //         chestNO,
  //       })
  //       .andWhere('program.curb_group = :curbGroup', {
  //         curbGroup,
  //       })
  //       // .andWhere('session.id = :sessionID', { sessionID })
  //       .select('candidateProgram.id')
  //       .getCount();

  //     let maxCurbGroupData = await candidateProgram
  //       .where('program.program_code = :programCode', {
  //         programCode,
  //       })
  //       // .andWhere('session.id = :sessionID', { sessionID })
  //       .select('program.max_count_curb')
  //       .getRawOne();
  //     let result1 = Object.values(JSON.parse(JSON.stringify(maxCurbGroupData)));
  //     let maxCurbGroup = result1[0];

  //     if (countCurbGroup > maxCurbGroup) {
  //       await this.candidateProgramRepository.delete(newCandidateProgram.id);
  //       throw new NotFoundException(
  //         'Candidate already enrolled in maximum number of a curb group',
  //       );
  //     }

  //     let languageGroupData = await candidateProgram
  //       .where('program.program_code = :programCode', {
  //         programCode,
  //       })
  //       // .andWhere('session.id = :sessionID', { sessionID })
  //       .select('program.language_group')
  //       .getRawOne();
  //     let result2 = Object.values(
  //       JSON.parse(JSON.stringify(languageGroupData)),
  //     );
  //     let languageGroup = result2[0];

  //     let countLanguageGroup = await candidateProgram
  //       .where('candidate.chestNO = :chestNO', {
  //         chestNO,
  //       })
  //       .andWhere('program.language_group = :languageGroup', {
  //         languageGroup,
  //       })
  //       // .andWhere('session.id = :sessionID', { sessionID })
  //       .select('candidateProgram.id')
  //       .getCount();

  //     if (countLanguageGroup > 1) {
  //       await this.candidateProgramRepository.delete(newCandidateProgram.id);
  //       throw new NotFoundException(
  //         'Candidate already enrolled in maximum number of a language group',
  //       );
  //     }
  //     return true;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
