import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from "moment";
import { throwError } from 'rxjs';
import { IFilter } from 'src/candidate/interfaces/filter.interface';
import { CategoryService } from 'src/category/category.service';
import { CoordinatorService } from 'src/coordinator/services/coordinator.service';
import { SessionStatus } from 'src/session/entities/session.entity';
import { SessionService } from 'src/session/session.service';
import { Repository } from 'typeorm';
import { CreateProgramDto } from './dto/create-program.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { UpdateSchedule } from './dto/update-schedule';
import { Program, PublishingStatus } from './entities/program.entity';

export interface IProgramFilter extends IFilter {
  sessionID: number,
  CategoryID: number,
  programCode:string,
}
@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    private readonly categoryService: CategoryService,
    private readonly coordinatorService: CoordinatorService,
    private readonly sessionService: SessionService,
  ) { }

  public async create(createProgramDto: CreateProgramDto): Promise<Program> {
    try {
      const category = await this.categoryService.findOne(
        createProgramDto.categoryID,
      );
      const session = await this.sessionService.findByID(
        createProgramDto.sessionID,
      );
      if (!category || !session)
        throw new NotFoundException('Category or Session not found');
      const program = this.programRepository.create(createProgramDto);
      program.session = session;
      program.category = category;
      await this.programRepository.save(program);
      return program;
    } catch (error) {
      throw error;
    }
  }

  public async addSchedule(id: number, schedule: CreateScheduleDto) {
    try {
      const program = await this.programRepository.findOne({
        where: {
          id: id
        }
      });
      if (!program) throw new NotFoundException('Program not found');
      program.date = schedule.date;
      program.s_time = schedule.s_time;
      program.venue = schedule.venue;
      program.e_time = schedule.e_time;
      await this.programRepository.save(program);
      return program;
    } catch (error) {
      throw error;
    }
  }

  public async findOneSchedule(id: number) {
    try {
      const program = await this.programRepository.findOne({
        where: {
          id: id
        }
      })
      const schedule = {
        date: program.date,
        s_time: program.s_time,
        venue: program.venue,
        e_time: program.e_time,
        id: program.id,
        name: program.name,
        code: program.programCode
      }
      return schedule;

    } catch (error) {
      throw error
    }
  }

  async findLivePg(time:string){
    try {
      let liveTime = moment().format("HH:mm:");
      const livePg = await this.programRepository.find({
        where:{
          s_time:liveTime
        }
      })
      console.log(liveTime);
      
    } catch (error) {
      throw error
    }
//     select * from hockey_stats 
// where game_date between '2012-03-11 00:00:00' and '2012-05-11 23:59:00' 
// order by game_date desc;
  }

  public async findAllSchedule(queryParams:IProgramFilter){
    try {
      const program = await this.programRepository.createQueryBuilder("program")
      .leftJoinAndSelect("program.category", "category")
      .select("program.id","id")
      .addSelect("program.name","name")
      .addSelect("program.programCode","code")
      .addSelect("program.venue","venue")
      .addSelect("program.e_time","e_time")
      .addSelect("program.date","date")
      .addSelect("program.s_time","s_time")
      .addSelect("category.name","category")
      .getRawMany()

      console.log(program);
      return program;
    } catch (error) {
      throw error
    }
  }

   findAllforJudges(): Promise<Program[]> {
    try {
      return this.programRepository.find();
    } catch (error) {
      throw error;
    }
  }
  public async findAll(queryParams: IProgramFilter): Promise<Program[]> {
    try {
      const programQuery =
        this.programRepository.createQueryBuilder('programs');
      const search = queryParams.search;
      const sort = queryParams.sort;
      const page = queryParams.page || 1;

      if (search) {
        programQuery.where('name LIKE :search OR programCode LIKE :search', {
          search: `%${search}%`,
        });
      }
      if (sort) {
        programQuery.orderBy('programs.name', sort).getMany();
      }
      const perPage = 15;
      programQuery.offset((page - 1) * perPage).limit(perPage);

      // const [programs, count] = await programQuery
      // .leftJoinAndSelect('programs.session', 'session')
      // .where('session.id = :sessionID', { sessionID: queryParams.session_id })
      // .andWhere('session.status = :status', { status: SessionStatus.ACTIVE })
      // .getManyAndCount();
      // return { programs, count };
      return this.programRepository.find({
        where: {
          session: {
            id: queryParams.sessionID,
            status: SessionStatus.ACTIVE,
          },
          programCode:queryParams.programCode
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async findEliminationPrograms() {
    try {
      return this.programRepository.find({
        where: [
          { categoryByFeatures: 'W' },
          { categoryByFeatures: 'X' },
          { categoryByFeatures: 'V' },
        ],

      });
    } catch (error) {
      throw error;
    }
  }
  public async findAllPublishedEliminationProgram() {
    try {
      return this.programRepository.find({
        where: {
          resultPublished: PublishingStatus.TRUE,
        },
        order: {
          updatedAt: 'DESC'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  public async findAllPublishedFinalProgram() {
    try {
      return this.programRepository.find({
        where: {
          resultPublished: PublishingStatus.TRUE,
        },
        order:{
          updatedAt: 'DESC'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  public async findAllForCoordinator(id: number): Promise<Program[]> {
    try {
      const coordinator = await this.coordinatorService.findOne(id);
      const sessionID = coordinator.session.id;
      // return this.programRepository.find()
      if (coordinator.institute.id == 41 || coordinator.institute.id == 42) {
        return this.programRepository.find({
          where: {
            session: {
              id: sessionID,
              status: SessionStatus.ACTIVE,
            },
            categoryByFeatures: 'Y',
          },
        });
      }
      return this.programRepository.find({
        where: {
          session: {
            id: sessionID,
            status: SessionStatus.ACTIVE,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async findOne(id: number): Promise<Program> {
    try {
      let program = await this.programRepository.findOneBy({ id });
      // console.log(program);

      // if (!program) throw new NotFoundException('Program not found');
      // if (!program.session || !program.session.status) return null;
      return program;
    } catch (error) {
      throw error;
    }
  }
  public async findOneByProgramCode(programCode: string): Promise<Program> {
    try {
      let program: Program = await this.programRepository.findOne({
        where: { programCode },
      });
      // console.log(program);
      // if (!program) throw new NotFoundException('Program not found');
      // if (!program.session || !program.session.status) return null;
      return program;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    id: number,
    updateProgramDto: UpdateProgramDto,
  ): Promise<boolean> {
    try {
      await this.programRepository.update(id, updateProgramDto);
      return true;
    } catch (error) {
      throw error;
    }
  }

  public async updateSchedule(
    id: number,
    updateScheduleDto: UpdateSchedule,
  ): Promise<boolean> {
    try {
      await this.programRepository.update(id,updateScheduleDto);
      return true;
    } catch (error) {
      throw error;
    }
  }

  public async remove(id: number): Promise<boolean> {
    try {
      await this.programRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // public async findProgramsByTopic(id:number){
  //   try{

  //     return await this.
  //   }catch(error){
  //     throw error;
  //   }
  // }
}
