import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { SessionStatus } from 'src/session/entities/session.entity';
import { SessionService } from 'src/session/session.service';
import { Repository } from 'typeorm';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { Program } from './entities/program.entity';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    private readonly categoryService: CategoryService,
    private readonly sessionService: SessionService,
  ) {}

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
      const program = await this.programRepository.save(createProgramDto);
      program.session = session;
      program.category = category;
      return program;
    } catch (error) {
      throw error;
    }
  }

  public async findAll(sessionID: number = 0): Promise<Program[]> {
    try {
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
      let program: Program = await this.programRepository.findOne({
        where: { id },
      });
      if (!program) throw new NotFoundException('Category not found');
      if (!program.session || !program.session.status) return null;
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
