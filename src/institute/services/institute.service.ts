import { Injectable } from '@nestjs/common';
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

    @InjectRepository(Institute)
    private readonly instituteRepository: Repository<Institute>,
  ) {}

  async findAllCandidates(): Promise<Candidate[]> {
    return this.candidateRepository.createQueryBuilder('candidate').getMany();
  }

  findCandidateByChestNo(chest_No: number): Promise<Candidate> {
    return this.candidateRepository.findOneBy({ chest_No: chest_No });
  }

  async createCandidate(
    candidateDTO: CandidateDTO,
    file: any,
  ): Promise<Candidate> {
    await this.checkEligibility(candidateDTO)
    candidateDTO.photoPath = file.path;
    candidateDTO.chest_No =
      (await this.getChestNO(candidateDTO.category_ID)) + 1;
    console.log(candidateDTO.chest_No);

    const newCandidate = this.candidateRepository.create(candidateDTO);
    return this.candidateRepository.save(newCandidate);
  }

  deleteCandidate(id: number) {
    return this.candidateRepository.delete({ id });
  }

  async queryBuilder(alias: string) {
    return this.candidateRepository.createQueryBuilder(alias);
  }

  async getChestNO(category_ID: string) {
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
  }

  getDefault(category_ID: string) {
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
  }
  async checkEligibility(candidateDTO:CandidateDTO){
    let candidate=await this.candidateRepository.createQueryBuilder("candidate")
    // .select("candidate.id")
    .where('ad_no = :id', { id: candidateDTO.ad_no })
    .andWhere('institute_ID = :id', { id: candidateDTO.institute_ID })
    .getOneOrFail()
    console.log(candidate);
    
  }
}
