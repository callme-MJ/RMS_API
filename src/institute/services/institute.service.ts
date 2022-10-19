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

  findCandidateByChestNo(chest_No: string): Promise<Candidate> {
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
      let chest_No = await this.getChestNO(candidateDTO);
      console.log(chest_No);
      candidateDTO.chest_No = chest_No;

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

  async getChestNO(candidateDTO: CandidateDTO) {
    try {
      let { category_ID, chest_No } = candidateDTO;
      const query = this.candidateRepository.createQueryBuilder('candidates');
      let Count = await this.candidateRepository.count({
        where: { category_ID: category_ID },
      });

      let def = await this.incrementString(
        this.getDefault(category_ID).toString(),
      );
      // console.log(def);

      let NIICSChestNO = 'N' + def;
      console.log(NIICSChestNO);

      let NIICSMax = await this.candidateRepository
        .createQueryBuilder('candidates')
        .leftJoinAndSelect('candidates.institute', 'institute')
        .leftJoinAndSelect('institute.session', 'session')
        .where('session.id = :session_ID', { session_ID: '2' })
        .select('candidates.chest_No', 'chest_No')
        .getRawMany();
      // console.log(NIICSMax);
      
      
      let NIICSarray = NIICSMax.map((item) => {
        NIICSChestNO= item.chest_No;
        return NIICSChestNO.match(/\d+/)[0]
        // NIICSChestNO = item.match(/(\d+)/);
        // NIICSChestNO.split('N');
        // return NIICSChestNO;
      });
      // console.log(Object.values(NIICSMax));
      console.log(NIICSarray);

      // console.log(NIICSMax);

      // if (Count < 1) {
      //   const def = this.getDefault(category_ID);
      //   return NIICSChestNO;
      //   return def;
      // } else {
      //   let result = await query
      //     .select('chest_No')
      //     .where('category_ID = :id', { id: category_ID })
      //     .orderBy('chest_No', 'DESC')
      //     .limit(1)
      //     .getRawOne()
      //     .then((result) => result.chest_No);
      //   return NIICSChestNO;
      // }
      return NIICSChestNO;
    } catch (error) {
      throw error;
    }
  }

  getDefault(category_ID: string) {
    try {
      switch (category_ID) {
        case 'uula':
          return '1000';
        case 'bidaya':
          return '2000';
        case 'saniya':
          return '3000';
        case 'sanaviyya':
          return '4000';
        case 'aliya':
          return '5000';
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

  async incrementString(str) {
    // Find the trailing number or it will match the empty string
    var count = await str.match(/\d*$/);

    // Take the substring up until where the integer was matched
    // Concatenate it to the matched count incremented by 1
    let result = (await str.substr(0, count.index)) + ++count[0];
    // console.log(result);
    return result;
  }
}
