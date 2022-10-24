import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IFilter } from 'src/candidate/interfaces/filter.interface';
import { CategoryService } from 'src/category/category.service';
import { Repository } from 'typeorm';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { Program } from './entities/program.entity';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
  ) {}

  public async create(createProgramDto: CreateProgramDto): Promise<Program> {
    try {
      return await this.programRepository.save(createProgramDto);
    } catch (error) {
      throw error;
    }
  }

  public async findAll(): Promise<Program[]> {
    try {
      return this.programRepository.find();
    } catch (error) {
      throw error;
    }
  }

  public async findOne(id: number): Promise<Program> {
    try {
      return this.programRepository.findOne({
        where: { id },
      });
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
