import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJudgeDto } from './dto/create-judge.dto';
import { UpdateJudgeDto } from './dto/update-judge.dto';
import { Judge } from './entities/judge.entity';

@Injectable()
export class JudgesService {
constructor(
  @InjectRepository(Judge)
  private readonly judgesRepo: Repository<Judge>,
) {}
  create(createJudgeDto: CreateJudgeDto) {
    return this.judgesRepo.create(createJudgeDto);
  }

  findAll() {
    return this.judgesRepo.find();
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
