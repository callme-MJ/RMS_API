import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateDTO } from '../dtos/candidate.dto';
import { Candidate } from '../entities/candidate.entity';
import { Institute } from '../entities/institute.entity';

@Injectable()
export class instituteService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async findAllCandidates(): Promise<Candidate[]> {
    try {
      return this.candidateRepository.createQueryBuilder('candidate').getMany();
    } catch (error) {
      throw error;
    }
  }

  findCandidateByChestNo(chest_No: number): Promise<Candidate> {
    try {
      return this.candidateRepository.findOneBy({ chest_No: chest_No });
    } catch (error) {
      throw error;
    }
  }

  async createCandidate(
    candidateDTO: CandidateDTO,
    file: any,
  ): Promise<Candidate> {
    let eligible = await this.checkEligibility(candidateDTO);
    if (eligible) {
      candidateDTO.photoPath = file.path;
      candidateDTO.chest_No =
        (await this.getChestNO(candidateDTO.category_ID)) + 1;
      const newCandidate = this.candidateRepository.create(candidateDTO);
      return this.candidateRepository.save(newCandidate);
    }
  }

  deleteCandidate(id: number) {
    try {
      return this.candidateRepository.delete({ id });
    } catch (error) {
      throw error;
    }
  }

  async queryBuilder(alias: string) {
    return this.candidateRepository.createQueryBuilder(alias);
  }

  async getChestNO(category_ID: string) {
    try {
      const query = this.candidateRepository.createQueryBuilder('candidates');
      let Count = await this.candidateRepository.count({
        where: { category_ID: category_ID },
      });

      if (Count < 1) {
        const def = this.getDefault(category_ID);
        return def;
      } else {
        let result = await query
          .select('chest_No')
          .where('category_ID = :id', { id: category_ID })
          .orderBy('chest_No', 'DESC')
          .limit(1)
          .getRawOne()
          .then((result) => result.chest_No);
        return result;
      }
    } catch (error) {
      throw error;
    }
  }

  getDefault(category_ID: string) {
    try {
      switch (category_ID) {
        case 'uula':
          return 1000;
        case 'bidaya':
          return 2000;
        case 'saniya':
          return 3000;
        case 'sanaviyya':
          return 4000;
        case 'aliya':
          return 5000;
      }
    } catch (error) {
      throw error;
    }
  }
  async checkEligibility(candidateDTO: CandidateDTO) {
    try {
      let { ad_no, institute_ID } = candidateDTO;
      let duplicate = await this.candidateRepository
        .createQueryBuilder('candidate')
        .where('ad_no = :ad_no', { ad_no })
        .andWhere('institute_ID = :institute_ID', { institute_ID })
        .getOne();
      if (duplicate) {
        throw new BadRequestException(
          'This candidate has been registered already',
        );
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}
