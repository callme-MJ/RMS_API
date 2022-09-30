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

  async findAllCandidates(query: any): Promise<candidate[]> {
    const options = { where: { ...query } };
    if (!query) delete options.where;
    return this.candidateRepository.find(options);
  }

  findCandidateById(candidateId: number): Promise<candidate> {
    return this.candidateRepository.findOneBy({
      id: candidateId,
    });
  }

  async createCandidate(
    candidateDto: candidateDto,
    file: any,
  ): Promise<candidate> {
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
    Cand.chest_No = (await this.getChestNO(Cand.category_Id)) + 1;
    const newCandidate = this.candidateRepository.create(Cand);
    return this.candidateRepository.save(newCandidate);
  }

  deleteCandidate(id: number) {
    return this.candidateRepository.delete({ id });
  }

  async queryBuilder(alias: string) {
    return this.candidateRepository.createQueryBuilder(alias);
  }

  async getChestNO(category_Id: string) {
    const query = this.candidateRepository.createQueryBuilder('candidates');
    let [allcandidates, Count] = await this.candidateRepository.findAndCount({
      where: { category_Id: category_Id },
    });

    if (Count < 1) {
      const def =  this.getDefault(category_Id);
      return def;
    } else {
      let result = await query
        .select('chest_No')
        .where('category_Id = :id', { id: category_Id })
        .orderBy('chest_No', 'DESC')
        .limit(1)
        .getRawOne()
        .then((result) => result.chest_No);
      return result;
    }
  }

  getDefault(candidate_id: string) {
    switch (candidate_id) {
      case 'uula':
        return 1000;
        break;
      case 'bidaya':
        return 2000;
        break;
      case 'saniya':
        return 3000;
        break;
      case 'sanaviyya':
        return 4000;
        break;
      case 'aliya':
        return 5000;
        break;
    }
  }
}
