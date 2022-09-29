import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { candidateDto } from '../dtos/candidate.dto';
import { candidate } from '../typeorm/entities/candidate';
import * as FormData from 'form-data';
import { Readable } from 'stream';

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

  createCandidate(candidateDto: candidateDto, file: any): Promise<candidate> {
    const Cand = new candidate();
    Cand.ad_no = candidateDto.ad_no;
    Cand.name = candidateDto.name;
    Cand.category_Id = candidateDto.category_Id;
    Cand.class = candidateDto.class;
    Cand.dob = candidateDto.dob;
    Cand.id = candidateDto.id;
    Cand.institute_Id = candidateDto.institute_Id;
    Cand.photoPath = file.path;
    file.filename = candidateDto.id;

    const newCandidate = this.candidateRepository.create(Cand);
    return this.candidateRepository.save(newCandidate);
  }
  deleteCandidate(id: number) {
    return this.candidateRepository.delete({ id });
  }

  async queryBuilder(alias: string) {
    return this.candidateRepository.createQueryBuilder(alias);
  }
}
