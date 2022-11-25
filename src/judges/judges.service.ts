import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramsService } from 'src/program/program.service';
import { Repository } from 'typeorm';
import { CreateJudgeDto } from './dto/create-judge.dto';
import { UpdateJudgeDto } from './dto/update-judge.dto';
import { Judge } from './entities/judge.entity';

@Injectable()
export class JudgesService {
constructor(
  @InjectRepository(Judge)
  private readonly judgesRepo: Repository<Judge>,
  private readonly programService: ProgramsService,

) {}
  async create(createJudgeDto: CreateJudgeDto) {
    const judge: Judge = this.judgesRepo.create(createJudgeDto);
    return await this.judgesRepo.save(judge);
  }

  async addProgram(code: string,id: number) {
    const program = await this.programService.findOneByProgramCode(code);
    const judge:Judge = await this.judgesRepo.findOneBy({id});
    return await this.judgesRepo.save(program);
  }

  findAll() {
    return this.judgesRepo.find();
  }

  public async findAllPrograms() {
    try {
      return this.programService.findAllforJudges();  
    } catch (error) {
      throw error;
    }
    
  }
  findOne(id: number) {
    return this.judgesRepo.findOneBy({id});
  }

  update(id: number, updateJudgeDto: UpdateJudgeDto) {
    return `This action updates a #${id} judge`;
  }

  remove(id: number) {
    return this.judgesRepo.delete(id);
  }
}
