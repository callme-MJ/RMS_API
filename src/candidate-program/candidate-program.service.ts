import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { IFilter } from 'src/candidate/interfaces/filter.interface';
import { CandidateService } from 'src/candidate/services/candidate.service';
import { CoordinatorService } from 'src/coordinator/services/coordinator.service';
import {
  EnteringStatus,
  Program,
  PublishingStatus
} from 'src/program/entities/program.entity';
import { ProgramsService } from 'src/program/program.service';
import { Session, SessionStatus } from 'src/session/entities/session.entity';
import { Repository } from 'typeorm';
import { CreateCandidateProgramDTO } from './dto/create-candidate-program.dto';
import { CreateTopicProgramDTO } from './dto/create-topic-program.dto';
import { UpdateCandidateProgramDTO } from './dto/update-candidate-program.dto';
import {
  CandidateProgram,
  RoundStatus,
  SelectionStatus,
  Status
} from './entities/candidate-program.entity';
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
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    private readonly candidateService: CandidateService,
    private readonly coordinatorService: CoordinatorService,
    private readonly programsService: ProgramsService,
  ) {}
  public async create(
    createCandidateProgramDTO: CreateCandidateProgramDTO,
    id?: number,
  ) {
    try {
      const loggedInCoordinator = await this.coordinatorService.findOne(id);
      const session: Session = loggedInCoordinator.institute.session;
      const candidate: Candidate =
        await this.candidateService.findCandidateBychestNO(
          createCandidateProgramDTO.chestNO,
          session.id,
        );
      const program: Program = await this.programsService.findOneByProgramCode(
        createCandidateProgramDTO.programCode,
      );
      if (!candidate) throw new NotFoundException('Candidate not found');
      const newCandidateProgram: CandidateProgram =
        await this.candidateProgramRepository.create(createCandidateProgramDTO);
      newCandidateProgram.candidate = candidate;
      await this.candidateProgramRepository
        .createQueryBuilder('candidatePrograms')
        .update(CandidateProgram)
        .set({ categoryID: candidate.categoryID })
        .where('candidate.id = :candidateId', { candidateId: candidate.id })
        .execute();

      newCandidateProgram.categoryID = candidate.categoryID;
      newCandidateProgram.institute = loggedInCoordinator.institute;
      newCandidateProgram.program = program;
      newCandidateProgram.session = session;
      await this.candidateProgramRepository.save(newCandidateProgram);
      await this.checkEligibility(newCandidateProgram);
      return newCandidateProgram;
    } catch (error) {
      throw error;
    }
  }

  async findCandidatesOfProgram(code: string) {
    const program = await this.programsService.findOneByProgramCode(code);
    // if (program.type == 'single') {
    const data = await this.candidateProgramRepository.find({
      where: { programCode: code },
    });
    const candidate = data.map((candidate) => candidate.candidate);
    console.log(candidate.length);
    return candidate;
  }

  async findCandidatesOfProgramOfFinal(code: string) {
    // const program = await this.programsService.findOneByProgramCode(code);
    const candidatePrograms = await this.candidateProgramRepository.find({
      where: { programCode: code, isSelected: SelectionStatus.TRUE  },
      order:{
        codeLetter:"asc",
      }
    });
    // const candidate = data.map((candidate) => candidate.candidate);

    console.log(candidatePrograms.length);
    return candidatePrograms;
  }
  
  async findCandidatesOfPublishedProgram(code: string) {
    let candidatePrograms = await this.candidateProgramRepository.find({
      where: {
        programCode: code,
        isSelected: SelectionStatus.TRUE,
        program: {
          resultPublished: PublishingStatus.TRUE,
        },
      },
    });
    return candidatePrograms;
  }

  async findSelectedOfInstitute(id: number) {
    let candidatePrograms = await this.candidateProgramRepository.find({
      where: {
        institute: {
          id: id,
        },
        isSelected: SelectionStatus.TRUE,
        program: {
          resultPublished: PublishingStatus.TRUE,
        },
      },
    });
    return candidatePrograms;
  }

  public async findSelected(code: string) {
    return this.candidateProgramRepository.find({
      where: {
        programCode: code,
        isSelected: SelectionStatus.TRUE,
      },
    });
  }

  public async findAll(
    queryParams: ICandidateProgramFIilter,
  ): Promise<CandidateProgram[]> {
    const candidateprogramsQuery =
      this.candidateProgramRepository.createQueryBuilder('candidatePrograms');

    const search = queryParams.search;
    const sort = queryParams.sort;
    const page = queryParams.page || 1;

    if (search) {
      candidateprogramsQuery.where(
        'program_name LIKE :search OR chestNO LIKE :search',
        { search: `%${search}%` },
      );
    }
    if (sort) {
      candidateprogramsQuery.orderBy('candidatePrograms.name', sort).getMany();
    }

    const perPage = 10;
    candidateprogramsQuery.offset((page - 1) * perPage).limit(perPage);
    try {
      let candidatePrograms = this.candidateProgramRepository.find({
        where: {
          session: {
            id: queryParams.sessionID,
            status: SessionStatus.ACTIVE,
          },
        },
        order: {
          chestNO: 'ASC',
        },
      });

      return candidatePrograms;
    } catch (error) {
      throw error;
    }
  }

  public async findAllCandidateProgramsOfInstitute(
    id: number,
    queryParams: ICandidateFIilter,
  ): Promise<CandidateProgram[]> {
    const loggedInCoordinator = await this.coordinatorService.findOne(id);
    // let candidatePrograms = await this.candidateProgramRepository
    //   .createQueryBuilder('candidatePrograms')
    //   .leftJoinAndSelect('candidatePrograms.candidate', 'candidate')
    //   .where('candidatePrograms.institute_id = :instituteId', {
    //     instituteId: loggedInCoordinator.institute.id,
    //   })
    //   .getMany();
    let candidatePrograms = await this.candidateProgramRepository.createQueryBuilder("candidatePrograms")
    .leftJoinAndSelect("candidatePrograms.candidate", "candidate")
    .leftJoinAndSelect("candidatePrograms.program", "program")
    .leftJoinAndSelect("candidatePrograms.institute", "institute")
    .where("candidatePrograms.institute_id = :instituteId", {
      instituteId: loggedInCoordinator.institute.id,
      })
    .select("candidatePrograms.id")
    .addSelect("candidatePrograms.chestNO")
    .addSelect("candidate.name")
    .addSelect("candidatePrograms.programCode")
    .addSelect("program.name","programName")
    .addSelect("candidatePrograms.topic")
    .addSelect("candidatePrograms.link")
    .getRawMany()



    return candidatePrograms;
  }

  public async findOne(id: number) {
    try {
      let candidateProgram = await this.candidateProgramRepository.createQueryBuilder("candidatePrograms")
      .leftJoinAndSelect("candidatePrograms.candidate", "candidate")
      .leftJoinAndSelect("candidatePrograms.program", "program")
      .leftJoinAndSelect("candidatePrograms.institute", "institute")
      .where("candidatePrograms.id = :id", {
        id: id,
        })
      .select("candidatePrograms.id")
      .addSelect("candidatePrograms.chestNO")
      .addSelect("candidate.name")
      .addSelect("candidatePrograms.programCode")
      .addSelect("program.name","programName")
      .addSelect("candidatePrograms.topic")
      .addSelect("candidatePrograms.link")
      .getRawOne()
      if (!candidateProgram)
        throw new NotFoundException(
          'Candidate has not applied for this program',
        );

      return candidateProgram;
    } catch (error) {}
  }

  public async update(
    id: number,
    updateCandidateProgramDto: UpdateCandidateProgramDTO,
  ) {
    try {
      const candidateProgram = await this.candidateProgramRepository.findOneBy({
        id,
      });
      if (!candidateProgram)
        throw new NotFoundException(
          'Candidate has not applied for this program',
        );

      const candidate: Candidate =
        await this.candidateService.findCandidateBychestNO(
          updateCandidateProgramDto.chestNO,
        );
      const program: Program = await this.programsService.findOneByProgramCode(
        updateCandidateProgramDto.programCode,
      );

      const newCandidateProgram = await this.candidateProgramRepository.save({
        ...candidateProgram,
        ...updateCandidateProgramDto,
        candidate: candidate,
        program: program,
        categoryID: candidate.categoryID,
      });
      // await updateAll();

      try {
        await this.checkEligibility(newCandidateProgram);
      } catch (error) {
        throw error;
      }
    } catch (error) {}
  }

  public async remove(id: number) {
    return this.candidateProgramRepository.delete(id);
  }

  public async checkEligibility(newCandidateProgram): Promise<boolean> {
    try {
      const { chestNO, programCode } = newCandidateProgram;

      const candidateProgram =  this.candidateProgramRepository
        .createQueryBuilder('candidateProgram')
        .leftJoinAndSelect('candidateProgram.candidate', 'candidate')
        .leftJoinAndSelect('candidateProgram.program', 'program')
        .leftJoinAndSelect('program.category', 'category')
        .leftJoinAndSelect('candidateProgram.institute', 'institute')
        .leftJoinAndSelect('candidateProgram.session', 'session');

      const instituteID = await newCandidateProgram.institute.id;
      const sessionID = await newCandidateProgram.session.id;
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

      let result3 = Object.values(JSON.parse(JSON.stringify(groupCountData)));
      let groupCount = result3[0];
      console.log(duplicateSingle, duplicateGroup);
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
        .andWhere('session.id = :sessionID', { sessionID })
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
        .andWhere('session.id = :sessionID', { sessionID })
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
        .andWhere('session.id = :sessionID', { sessionID })
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
        .andWhere('session.id = :sessionID', { sessionID })
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

  public async updateAll() {
    try {
      const candidatePrograms = await this.candidateProgramRepository
        .createQueryBuilder('candidateProgram')
        .update(CandidateProgram);
    } catch (error) {
      throw error;
    }
  }

  async findCandidateProgramsByChestNO(chestNO: number, coordinatorID: number) {
    const loggedInCoordinator = await this.coordinatorService.findOne(
      coordinatorID,
    );
    const programsOFCandidate = await this.candidateProgramRepository
      .createQueryBuilder('candidatePrograms')
      .leftJoinAndSelect('candidatePrograms.candidate', 'candidate')
      .leftJoinAndSelect('candidate.institute', 'institute')
      .leftJoinAndSelect('candidatePrograms.program', 'program')
      .leftJoinAndSelect('program.category', 'category')
      .select('candidate.name')
      .addSelect('candidate.photo')
      .addSelect('program.name')
      .addSelect('candidate.chestNO')
      .addSelect('institute.name')
      .addSelect('category.name')
      .where('candidatePrograms.chestNO = :chestNO', { chestNO })
      .andWhere('institute.id = :id', { id: loggedInCoordinator.institute.id })
      .getRawMany();
    const result = [];
    programsOFCandidate.forEach((program) => {
      result.push(program.program_name);
    });
    const searchCandidate = {
      chestNO: programsOFCandidate[0].candidate_chest_no,
      name: programsOFCandidate[0].candidate_name,
      institute: programsOFCandidate[0].institute_name,
      photo: programsOFCandidate[0].candidate_photo,
      category: programsOFCandidate[0].category_name,
      programs: result,
    };
    return searchCandidate;
  }

  async findCandidateProgramsByInstitute(coordinatorID: number) {
    const loggedInCoordinator = await this.coordinatorService.findOne(
      coordinatorID,
    );
    const programsOFCandidate = await this.candidateProgramRepository
      .createQueryBuilder('candidatePrograms')
      .leftJoinAndSelect('candidatePrograms.candidate', 'candidate')
      .leftJoinAndSelect('candidate.institute', 'institute')
      .leftJoinAndSelect('candidatePrograms.program', 'program')
      .leftJoinAndSelect('program.category', 'category')
      .select('candidate.name')
      .addSelect('candidate.photo')
      .addSelect('program.name')
      .addSelect('candidate.chestNO')
      .addSelect('institute.name')
      .addSelect('category.name')
      .where('institute.id = :id', { id: loggedInCoordinator.institute.id })
      .getRawMany();
    const result = [];

    programsOFCandidate.forEach((program) => {
      result.push(program.program_name);
    });

    var output = [];

    programsOFCandidate.forEach(function (item) {
      var existing = output.filter(function (v, i) {
        return v.candidate_chest_no == item.candidate_chest_no;
      });
      if (existing.length) {
        var existingIndex = output.indexOf(existing[0]);
        output[existingIndex].program_name = output[
          existingIndex
        ].program_name.concat(item.program_name);
      } else {
        if (typeof item.program_name == 'string')
          item.program_name = [item.program_name];
        output.push(item);
      }
    });

    return output;
  }
  async findCandidatePrograms(queryParams: any) {
    const programsOFCandidate = await this.candidateProgramRepository
      .createQueryBuilder('candidatePrograms')
      .leftJoinAndSelect('candidatePrograms.candidate', 'candidate')
      .leftJoinAndSelect('candidate.institute', 'institute')
      .leftJoinAndSelect('candidatePrograms.program', 'program')
      .leftJoinAndSelect('program.category', 'category')
      .leftJoinAndSelect('candidatePrograms.session', 'session')
      .select('candidate.name')
      .addSelect('candidate.photo')
      .addSelect('program.name')
      .addSelect('candidate.chestNO')
      .addSelect('institute.name')
      .addSelect('category.name')
      .where('session.id = :id', { id: queryParams.sessionID })
      .getRawMany();
    const result = [];

    programsOFCandidate.forEach((program) => {
      result.push(program.program_name);
    });

    var output = [];

    programsOFCandidate.forEach(function (item) {
      var existing = output.filter(function (v, i) {
        return v.candidate_chest_no == item.candidate_chest_no;
      });
      if (existing.length) {
        var existingIndex = output.indexOf(existing[0]);
        output[existingIndex].program_name = output[
          existingIndex
        ].program_name.concat(item.program_name);
      } else {
        if (typeof item.program_name == 'string')
          item.program_name = [item.program_name];
        output.push(item);
      }
    });

    return output;
  }

  public async findAllTopicsOfInstitute(
    id: number,
  ): Promise<CandidateProgram[]> {
    const loggedInCoordinator = await this.coordinatorService.findOne(id);
    let registerablePrograms = await this.candidateProgramRepository
      .createQueryBuilder('candidatePrograms')
      .leftJoinAndSelect('candidatePrograms.program', 'program')
      .leftJoinAndSelect('candidatePrograms.candidate', 'candidate')
      .where('program.isRegisterable = :status', { status: 'true' })
      .andWhere('candidate.institute.id = :instituteId', {
        instituteId: loggedInCoordinator.institute.id,
      })
      .andWhere('candidatePrograms.isSelected = :status', {
        status: 'true',
      })
      .getMany();
    return registerablePrograms;
  }

  public async createTopic(
    createTopicProgramDto: CreateTopicProgramDTO,
    id: number,
  ): Promise<CandidateProgram> {
    const candidateProgram = await this.candidateProgramRepository.findOneBy({
      id,
    });
    if (!candidateProgram) {
      throw new NotFoundException('Candidate  not registered for this program');
    }
    candidateProgram.topic = createTopicProgramDto.topic;
    candidateProgram.link = createTopicProgramDto.link;
    candidateProgram.status = Status.Pending;
    await this.candidateProgramRepository.save(candidateProgram);
    return candidateProgram;
  }

  public async updateSelection(id: number): Promise<CandidateProgram> {
    const candidateProgram = await this.candidateProgramRepository.findOneBy({
      id,
    });
    if (!candidateProgram) {
      throw new NotFoundException('Candidate not registered for this program');
    }
    const program: Program = await this.programsService.findOne(
      candidateProgram.program.id,
    );
    const selectedCount = await this.candidateProgramRepository
      .createQueryBuilder('candidatePrograms')
      .leftJoinAndSelect('candidatePrograms.program', 'program')
      .select('COUNT(candidatePrograms.id)')
      .where('candidatePrograms.programCode = :programCode', {
        programCode: program.programCode,
      })
      .andWhere("candidatePrograms.is_selected = 'true'")
      .getCount();
    console.log(program.programCode);
    console.log('selected count  ' + selectedCount);

    if (selectedCount >= program.maxSelection) {
      throw new NotFoundException('Maximum Selection Reached');
    } else {
      candidateProgram.isSelected = SelectionStatus.TRUE;
    }
    await this.candidateProgramRepository.save(candidateProgram);
    const selectedCount2 = await this.candidateProgramRepository
      .createQueryBuilder('candidatePrograms')
      .leftJoinAndSelect('candidatePrograms.program', 'program')
      .select('COUNT(candidatePrograms.id)')
      .where('program.id = :id', { id: program.id })
      .andWhere("candidatePrograms.is_selected = 'true'")
      .getCount();
    if (selectedCount2 == program.maxSelection) {
      program.resultEntered = EnteringStatus.TRUE;
    } else if (selectedCount2 < program.maxSelection) {
      program.resultEntered = EnteringStatus.FALSE;
    }
    await this.programsService.update(program.id, program);
    console.log(selectedCount2, program.maxSelection);
    console.log("program's result is " + program.resultEntered);
    candidateProgram.round = RoundStatus.Final;
    await this.candidateProgramRepository.save(candidateProgram);
    return candidateProgram;
  }
  

  public async deleteSelection(id: number): Promise<CandidateProgram> {
    const candidateProgram = await this.candidateProgramRepository.findOneBy({
      id,
    });
    if (!candidateProgram) {
      throw new NotFoundException('Candidate  not registered for this program');
    }
    candidateProgram.isSelected = SelectionStatus.FALSE;
    await this.candidateProgramRepository.save(candidateProgram);
    return candidateProgram;
  }

  public async getoverview() {
    const overview = await this.candidateProgramRepository.createQueryBuilder("candidateProgram")
    .leftJoinAndSelect("candidateProgram.program","program")
    .leftJoinAndSelect("candidateProgram.session","session")
    .leftJoinAndSelect("candidateProgram.candidate","candidate")
    .leftJoinAndSelect("candidate.institute","institute")
    .leftJoinAndSelect("program.category","category")
    .where("candidateProgram.round = :round",{round:RoundStatus.Final})
    .select("candidateProgram.chestNO","chestNO")
    .addSelect("candidate.name","candidateName")
    .addSelect("institute.short_name","institutionCode")
    .addSelect("institute.name","instituteName")
    .addSelect("candidateProgram.program_name","programName")
    .addSelect("candidateProgram.program_code","program_code")
    .addSelect("program.type","programType")
    .addSelect("category.name","categoryName")
    .addSelect("candidateProgram.position,candidateProgram.grade,candidateProgram.postion_point,candidateProgram.grade_point,candidateProgram.point","totalPoint")
    .addSelect("program.final_result_entered","result_entered")
    .addSelect("program.final_result_published","result_published")
    .addSelect("program.private_published","result_accounced")
    .addSelect("session.name","sessionName")
    .getRawMany()
    console.log(overview.length)
    return overview;
  }

  public async findAllTopics(id: number): Promise<CandidateProgram[]> {
    const loggedInCoordinator = await this.coordinatorService.findOne(id);
    let registerablePrograms = await this.candidateProgramRepository
      .createQueryBuilder('candidatePrograms')
      .leftJoinAndSelect('candidatePrograms.program', 'program')
      .leftJoinAndSelect('candidatePrograms.candidate', 'candidate')
      .where('program.isRegisterable = :status', { status: 'true' })
      .getMany();
    return registerablePrograms;
  }

  public async getSelectedCandidates(id: number): Promise<CandidateProgram[]> {
    const loggedInCoordinator = await this.coordinatorService.findOne(id);
    const selectedCandidates = await this.candidateProgramRepository.createQueryBuilder("candidateProgram")
    .leftJoinAndSelect("candidateProgram.program","program")
    .leftJoinAndSelect("candidateProgram.session","session")
    .leftJoinAndSelect("candidateProgram.candidate","candidate")
    .leftJoinAndSelect("candidate.institute","institute")
    .leftJoinAndSelect("program.category","category")
    .where("candidateProgram.round = :round",{round:RoundStatus.Final})
    .andWhere("candidateProgram.is_selected = :status",{status:SelectionStatus.TRUE})
    .andWhere("program.id = :id",{id:loggedInCoordinator.institute.id})
    .andWhere("program.final_result_published = :status",{status:PublishingStatus.TRUE})
    .select("candidateProgram.chestNO","chestNO")
    .addSelect("candidate.name","candidateName")
    .addSelect("institute.short_name","institutionCode")
    .addSelect("institute.name","instituteName")
    .addSelect("candidateProgram.program_name","programName")
    .addSelect("candidateProgram.program_code","program_code")
    .addSelect("program.type","programType")
    .addSelect("category.name","categoryName")
    .addSelect("candidateProgram.topic","topics")
    .addSelect("candidateProgram.link","link")
    .getRawMany()
    
    // let selectedCandidates = await this.candidateProgramRepository.find({
    //   where: {
    //     institute: {
    //       id: loggedInCoordinator.institute.id,
    //     },
    //     isSelected: SelectionStatus.TRUE,
    //     program: {
    //       resultPublished: PublishingStatus.TRUE,
    //     },
    //   },
    // });
    return selectedCandidates;
  }
}
