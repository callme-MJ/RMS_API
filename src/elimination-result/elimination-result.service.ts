import { Injectable } from '@nestjs/common';
import { CreateEliminationResultDto } from './dto/create-elimination-result.dto';
import { UpdateEliminationResultDto } from './dto/update-elimination-result.dto';

@Injectable()
export class EliminationResultService {
  create(createEliminationResultDto: CreateEliminationResultDto) {
    return 'This action adds a new eliminationResult';
  }

  findAll() {
    return `This action returns all eliminationResult`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eliminationResult`;
  }

  update(id: number, updateEliminationResultDto: UpdateEliminationResultDto) {
    return `This action updates a #${id} eliminationResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} eliminationResult`;
  }
}
