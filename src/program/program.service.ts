import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidateProgram } from 'src/candidate-program/entities/candidate-program.entity';
import { IFilter } from 'src/candidate/interfaces/filter.interface';
import { CategoryService } from 'src/category/category.service';
import { CoordinatorService } from 'src/coordinator/services/coordinator.service';
import { SessionStatus } from 'src/session/entities/session.entity';
import { SessionService } from 'src/session/session.service';
import { Repository } from 'typeorm';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { Program } from './entities/program.entity';

export interface IProgramFilter extends IFilter {
  session_id: number;
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
      const program = await this.programRepository.create(createProgramDto);
      program.session = session;
      program.category = category;
      await this.programRepository.save(program);
      return program;
    } catch (error) {
      throw error;
    }
  }

  public async findAll(queryParams: IProgramFilter): Promise<{ programs: Program[], count: number }> {
    try {
      const programQuery = this.programRepository.createQueryBuilder(
        'programs',
      );
      const search = queryParams.search;
      const sort = queryParams.sort;
      const page = queryParams.page || 1;

      if (search) {
        programQuery.where(
          'name LIKE :search OR programCode LIKE :search',
          { search: `%${search}%` },
        );
      }
      if (sort) {
        programQuery.orderBy('programs.name', sort).getMany();
      }
      const perPage = 15;
      programQuery.offset((page - 1) * perPage).limit(perPage);

      const [programs, count] = await programQuery
      .leftJoinAndSelect('programs.session', 'session')
      .where('session.id = :sessionID', { sessionID: queryParams.session_id })
      .andWhere('session.status = :status', { status: SessionStatus.ACTIVE })
      .getManyAndCount();
      return { programs, count };
      // return this.programRepository.find({
      //   where: {
      //     session: {
      //       id: queryParams.sessionID,
      //       status: SessionStatus.ACTIVE,
      //     },
      //   },
      // });
    } catch (error) {
      throw error;
    }
  }

  public async findAllForCoordinator(session:number): Promise<Program[]> {
    try {
      const coordinator = await this.coordinatorService.findOne(session);
      const sessionID = coordinator.session.id;
      // return this.programRepository.find()
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

  public async remove(id: number): Promise<boolean> {
    try {
      await this.programRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
