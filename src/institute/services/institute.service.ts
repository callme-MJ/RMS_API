import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateDTO } from '../dtos/candidate.dto';
import { Candidate } from '../entities/candidate.entity';
import { Institute } from '../entities/institute.entity';
import { Photo } from '../entities/photo.entitiy';
import { S3Service } from './s3.service';
@Injectable()
export class InstituteService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(Institute)
    private readonly instituteRepository: Repository<Institute>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
  ) {}

  async findAllCandidates(): Promise<Candidate[]> {
    try {
      return await this.candidateRepository.find({
        relations: ['photo']
      });
    } catch (error) {
      throw error;
    }
  }

  findCandidateByID(id: number): Promise<Candidate> {
    try {
      return this.candidateRepository.findOneBy({ id: id });
    } catch (error) {
      throw error;
    }
  }

  findCandidateBychestNO(chestNO: string): Promise<Candidate> {
    try {
      return this.candidateRepository.findOneBy({ chestNO: chestNO });
    } catch (error) {
      throw error;
    }
  }

  async createCandidate(
    candidateDTO: CandidateDTO,
    file: any,
    // location: string,
    // eTag: string,
    // key: string,
  ): Promise<Candidate> {
    let eligible = await this.checkEligibility(candidateDTO);
    if (eligible) {
      let photoDTO = await this.s3Service.uploadFile(file);
      let { Location, ETag, Key } = photoDTO;
      let photo = await this.photoRepository.create({
        url: Location,
        eTag: ETag,
        key: Key,
      });
      await this.photoRepository.save(photo);
      let chestNO = await this.getchestNO(candidateDTO);
      candidateDTO.photo = photo;
      candidateDTO.chestNO = chestNO;
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
        let updatedCandidate = this.candidateRepository.update(
          { id },
          { ...candidateDTO },
        );
        return updatedCandidate;
      }
    } catch (error) {
      throw error;
    }
  }

  async getchestNO(candidateDTO: CandidateDTO) {
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
        let chestNOArray = await this.candidateRepository
          .createQueryBuilder('candidates')
          .leftJoinAndSelect('candidates.institute', 'institute')
          .leftJoinAndSelect('institute.session', 'session')
          .where('session.is_niics = :session', { session })
          .andWhere('candidates.categoryID = :categoryID', { categoryID })
          .select('candidates.chestNO', 'chestNO')
          .getRawMany();
        let array = chestNOArray.map((item) => {
          let chestNO = item.chestNO;
          chestNO = chestNO.match(/\d+/)[0];
          return parseInt(chestNO);
        });
        let chestNOMax = Math.max(...array);
        return session == 0
          ? this.incrementString(chestNOMax.toString())
          : this.incrementString('N' + chestNOMax.toString());
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
      let { adno, instituteID } = candidateDTO;
      let duplicate = await this.candidateRepository
        .createQueryBuilder('candidate')
        .where('adno = :adno', { adno })
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
    var count = await str.match(/\d*$/);
    return (await str.substr(0, count.index)) + ++count[0];
  }
}
