import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'aws-sdk';
import { Repository } from 'typeorm';
import { CandidateDTO } from '../dtos/candidate.dto';
import { Candidate } from '../entities/candidate.entity';
import { Institute } from '../entities/institute.entity';
import { S3Service } from './s3Bucket.service';
@Injectable()
export class InstituteService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(Institute)
    private readonly instituteRepository: Repository<Institute>,
    private readonly s3Service: S3Service,

  ) {}

  async findAllCandidates(): Promise<Candidate[]> {
    try {
      let candidates = await this.candidateRepository.find();
      return candidates;
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
      console.log('chestNo is ' + chest_No);
      
      candidateDTO.chest_No = chest_No;
      let s3Response=await this.s3Service.uploadFile(file);
      console.log(s3Response);
      
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
  async updateCandidate(id: number, candidateDTO: CandidateDTO) {
    try {
      let candidate = await this.candidateRepository.findOneBy({ id });
      if (candidate) {
        let updatedCandidate = this.candidateRepository.update({id},{...candidateDTO});
        return updatedCandidate;
      }
    } catch (error) {
      throw error;
    }
  }

  async getChestNO(candidateDTO: CandidateDTO) {
    try {
      let { categoryID, instituteID } = candidateDTO;

      let session = await this.instituteRepository
        .createQueryBuilder('institute')
        .leftJoinAndSelect('institute.session', 'session')
        .select('session.is_niics')
        .where('institute.id = :instituteID', { instituteID })
        .getRawOne();
      session = Object.values(JSON.parse(JSON.stringify(session)));
      session = Number(session);

      let count = await this.candidateRepository
        .createQueryBuilder('candidate')
        .leftJoinAndSelect('candidate.institute', 'institute')
        .leftJoinAndSelect('institute.session', 'session')
        .select('candidate.id')
        .where('session.is_niics = :session', { session })
        .andWhere('candidate.categoryID = :categoryID', { categoryID })
        .getCount();

      if (count < 1) {
        const def = this.getDefault(categoryID);
        return session == 0
          ? this.incrementString(def.toString())
          : this.incrementString('N' + def.toString());
      } else if (count >= 1) {
        let ChestNoArray = await this.candidateRepository
          .createQueryBuilder('candidates')
          .leftJoinAndSelect('candidates.institute', 'institute')
          .leftJoinAndSelect('institute.session', 'session')
          .where('session.is_niics = :session', { session })
          .andWhere('candidates.categoryID = :categoryID', { categoryID })
          .select('candidates.chest_No', 'chest_No')
          .getRawMany();
        let array = ChestNoArray.map((item) => {
          let chestNo = item.chest_No;
          chestNo = chestNo.match(/\d+/)[0];
          return parseInt(chestNo);
        });
        let chestNoMax = Math.max(...array);
        return session == 0
          ? this.incrementString(chestNoMax.toString())
          : this.incrementString('N' + chestNoMax.toString());
      }
    } catch (error) {
      throw error;
    }
  }

  getDefault(categoryID: string) {
    try {
      switch (categoryID) {
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
      let { ad_no, instituteID } = candidateDTO;
      let duplicate = await this.candidateRepository
        .createQueryBuilder('candidate')
        .where('ad_no = :ad_no', { ad_no })
        .andWhere('institute_ID = :instituteID', { instituteID })
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
