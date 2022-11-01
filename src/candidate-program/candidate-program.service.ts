import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { updateLocale } from 'moment';
import { IcalAttachment } from 'nodemailer/lib/mailer';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import { IFilter } from 'src/candidate/interfaces/filter.interface';
import { CandidateService } from 'src/candidate/services/candidate.service';
import { CoordinatorService } from 'src/coordinator/services/coordinator.service';
import { Program } from 'src/program/entities/program.entity';
import { ProgramsService } from 'src/program/program.service';
import { SessionStatus } from 'src/session/entities/session.entity';
import { Repository } from 'typeorm';
import { CreateCandidateProgramDTO } from './dto/create-candidate-program.dto';
import { CreateTopicStatusDTO } from './dto/create-status-topic.dto';
import { CreateTopicProgramDTO } from './dto/create-topic-program.dto';
import { UpdateCandidateProgramDTO } from './dto/update-candidate-program.dto';
import { CandidateProgram, Status } from './entities/candidate-program.entity';
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
  public async create(createCandidateProgramDTO: CreateCandidateProgramDTO) {
    try {
      const candidate: Candidate =
        await this.candidateService.findCandidateBychestNO(
          createCandidateProgramDTO.chestNO,
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
      newCandidateProgram.program = program;
      await this.candidateProgramRepository.save(newCandidateProgram);
      await this.checkEligibility(newCandidateProgram);
      return newCandidateProgram;
    } catch (error) {
      throw error;
    }
  }

  public async findAll(
    queryParams: ICandidateProgramFIilter,
  ): Promise<CandidateProgram[]> {
    const candidateprogramsQuery =
      this.candidateProgramRepository.createQueryBuilder('candidates');

    const search = queryParams.search;
    const sort = queryParams.sort;
    const page = queryParams.page || 1;

    if (search) {
      candidateprogramsQuery.where(
        'name LIKE :search OR chestNO LIKE :search',
        { search: `%${search}%` },
      );
    }
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
              status: SessionStatus.ACTIVE,
            },
          },
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
    let candidatePrograms = await this.candidateProgramRepository
      .createQueryBuilder('candidatePrograms')
      .leftJoinAndSelect('candidatePrograms.candidate', 'candidate')
      .where('candidate.institute.id = :instituteId', {
        instituteId: loggedInCoordinator.institute.id,
      })
      .getMany();

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

  public async createTopic(createTopicDTO: CreateTopicProgramDTO) {
    try {
      const candidateProgram = await this.candidateProgramRepository.findOne({
        where: {
          chestNO: createTopicDTO.chestNO,
          programCode: createTopicDTO.programCode,
        },
      });
      if (!candidateProgram) {
        throw new NotFoundException('Candidate not enrolled in this program');
      }
      // const newTopic = await this.candidateProgramRepository.createQueryBuilder()
      // .update(CandidateProgram)
      // .set({topic: createTopicDTO.topic, link: createTopicDTO.link})
      // .
      // const newTopic = await this.topicRepository.create(createTopicDTO);
      // let candidateProgram=await this.candidateProgramRepository.createQueryBuilder('candidateProgram')
      // .update(CandidateProgram)
      // .set({topic:createTopicDTO.topic,link:createTopicDTO.link})
      // .where('id = :id', { id: createTopicDTO.id })
      // .execute();
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
    console.log(loggedInCoordinator.institute.id);
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
    console.log(programsOFCandidate);

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

  public async findAllCandidateProgramsOfInstituteByTopic(id: number, queryParams: ICandidateFIilter): Promise<CandidateProgram[]> {
    const loggedInCoordinator = await this.coordinatorService.findOne(id);
    let registerablePrograms = await this.candidateProgramRepository.createQueryBuilder('candidatePrograms')
      .leftJoinAndSelect('candidatePrograms.program', 'program')
      .leftJoinAndSelect('candidatePrograms.candidate', 'candidate')
      .where('program.isRegisterable = :status', { status: "true" })
      .andWhere('candidate.institute.id = :instituteId', { instituteId: loggedInCoordinator.institute.id })
      .getMany()
    console.log(registerablePrograms);
    return registerablePrograms;
  }

  public async findAllRegisterablePrograms( queryParams: ICandidateFIilter): Promise<CandidateProgram[]> {
    let registerablePrograms = await this.candidateProgramRepository.createQueryBuilder('candidatePrograms')
      .leftJoinAndSelect('candidatePrograms.program', 'program')
      .leftJoinAndSelect('candidatePrograms.candidate', 'candidate')
      .where('program.isRegisterable = :status', { status: "true" })
      .getMany()
    console.log(registerablePrograms);
    return registerablePrograms;
  }

  public async addTopicsToCandidateProgram(id: number, createTopicDTO: CreateTopicProgramDTO) {
    const loggedInCoordinator = await this.coordinatorService.findOne(id);
    const candidateProgram = await this.candidateProgramRepository.createQueryBuilder('candidatePrograms')
      .leftJoinAndSelect('candidatePrograms.program', 'program')
      .leftJoinAndSelect('candidatePrograms.candidate', 'candidate')
      .where('program.isRegisterable = :true', { true: "true" })
      .andWhere('candidate.institute.id = :instituteId', { instituteId: loggedInCoordinator.institute.id })
      // .andWhere('candidatePrograms.chestNO = :chestNO', { chestNO: createTopicDTO.chestNO })
      // .andWhere('candidatePrograms.programCode = :programCode', { programCode: createTopicDTO.programCode })
      .getOne();
    if (!candidateProgram) {
      throw new NotFoundException('Candidate not enrolled in this program');
    }
    // const sameProgram= await this.candidateProgramRepository.createQueryBuilder('candidatePrograms')
    //   .leftJoinAndSelect('candidatePrograms.program', 'program')
    //   .leftJoinAndSelect('candidatePrograms.candidate', 'candidate')
    //   .where('program.isRegisterable = :true', { true: "true" })
    //   .andWhere('candidate.institute.id = :instituteId', { instituteId: loggedInCoordinator.institute.id })
    //   .andWhere('candidatePrograms.programCode = :programCode', { programCode: createTopicDTO.programCode })
    //   .getMany();

    candidateProgram.topic = createTopicDTO.topic;
    candidateProgram.link = createTopicDTO.link;
    candidateProgram.status = Status.Pending;
    // sameProgram.forEach(async (program) => {
    //   program.topic = createTopicDTO.topic;
    //   program.link = createTopicDTO.link;
    //   await this.candidateProgramRepository.save(program);
    // })
    const updatedCandidateProgram = await this.candidateProgramRepository.save(candidateProgram);
    return updatedCandidateProgram;
  }

  // public async updateStatusOfRegisterablePrograms(id: number, createTopicStatusDTO: CreateTopicStatusDTO) {
  //   const candidateProgram = await this.candidateProgramRepository.createQueryBuilder('candidatePrograms')
  //     .leftJoinAndSelect('candidatePrograms.program', 'program')
  //     .leftJoinAndSelect('candidatePrograms.candidate', 'candidate')
  //     .where('program.isRegisterable = :true', { true: "true" })
  //     // .andWhere('candidatePrograms.chestNO = :chestNO', { chestNO: createTopicStatusDTO.chestNO })
  //     // .andWhere('candidatePrograms.programCode = :programCode', { programCode: createTopicStatusDTO.programCode })
  //     .getOne();
  //   if (!candidateProgram) {
  //     throw new NotFoundException('Candidate not enrolled in this program');
  //   }
  //   candidateProgram.status = createTopicStatusDTO.status;
  //   const updatedCandidateProgram = await this.candidateProgramRepository.save(candidateProgram);
  //   return updatedCandidateProgram;
  // }

}
