import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { candidateDto } from '../dtos/candidate.dto';
import { candidate } from '../typeorm/entities/candidate';

@Injectable()
export class CollegesService {
  constructor(
    @InjectRepository(candidate)
    private readonly candidateRepository: Repository<candidate>,
  ) {}

  findAllCandidates(): Promise<candidate[]> {
    return this.candidateRepository.find();
  }

  findCandidateById(candidateId: number): Promise<candidate> {
    return this.candidateRepository.findOneBy({
      id: candidateId,
    });
  }

  createCandidate(candidateDto: candidateDto): Promise<candidate> {
    const newCandidate = this.candidateRepository.create(candidateDto);
    return this.candidateRepository.save(newCandidate);
  }
  deleteCandidate(id: number) {
    return this.candidateRepository.delete({ id });
  }

  async queryBuilder(alias: string) {
    return this.candidateRepository.createQueryBuilder(alias);
  }
}
