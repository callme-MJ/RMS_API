import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { CoordinatorService } from 'src/coordinator/services/coordinator.service';
import { NotFoundException } from 'src/exceptions/not-found-exception';
import { ValidationException } from 'src/exceptions/validation-exception';
import { Institute } from 'src/institute/entities/institute.entity';
import { InstituteService } from 'src/institute/institute.service';
import { SessionService } from 'src/session/session.service';
import { Repository } from 'typeorm';
import { CandidateDTO } from '../dtos/candidate.dto';
import { UpdateCandidateDTO } from '../dtos/update-candidate.dto';
import { Candidate, Gender } from '../entities/candidate.entity';
import { IFilter } from '../interfaces/filter.interface';
import { S3Service } from './s3.service';


export interface ICandidateFilter extends IFilter {
  instituteID: number;
}

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    // @InjectRepository(Coordinator)
    // private readonly coordinatorRepo: Repository<Coordinator>,
    private coordinatorService: CoordinatorService,
    private readonly s3Service: S3Service,
    private readonly sessionService: SessionService,
    private readonly instituteService: InstituteService,
    private readonly categoryService: CategoryService
  ) { }

  async findAllCandidates(queryParams: ICandidateFilter): Promise<{ candidates: Candidate[], count: number }> {
    try {
      const candidatesQuery = this.candidateRepository.createQueryBuilder(
        'candidates',
      );

      const search = queryParams.search;
      const sort = queryParams.sort;
      const page = queryParams.page || 1;

      if (search) {
        candidatesQuery.where(
          'name LIKE :search OR chestNO LIKE :search',
          { search: `%${search}%` },
        );
      }

      if (queryParams.instituteID) {
        candidatesQuery.andWhere('institute_id = :institueID', { institueID: queryParams.instituteID });
      }

      if (sort) {
        candidatesQuery.orderBy('candidates.name', sort).getMany();
      }

      const perPage = 15;
      candidatesQuery.offset((page - 1) * perPage).limit(perPage);

      const [candidates, count] = await candidatesQuery.getManyAndCount();

      return { candidates, count };
    } catch (error) {
      throw error;
    }
  }

  async findAllCandidatesOfInstitute(id: number, queryParams: ICandidateFilter) {
    const loggedInCoordinator = await this.coordinatorService.findOne(id);
    let candidates= await this.candidateRepository.createQueryBuilder('candidates')
    .where('candidates.institute_id = :instituteID', { instituteID: loggedInCoordinator.institute.id })
    .getMany();
    return candidates;
  }

  findCandidateByID(id: number): Promise<Candidate> {
    try {
      return this.candidateRepository.findOne({
        where: { id }
      });
    } catch (error) {
      throw error;
    }
  }

  findCandidateBychestNO(chestNO: number): Promise<Candidate> {
    try {
      return this.candidateRepository.findOneBy({ chestNO: chestNO });
    } catch (error) {
      throw error;
    }
  }

  async createCandidate(
    candidateDTO: CandidateDTO,
    photo: Express.Multer.File,
    id?: number,
  ): Promise<Candidate> {
    await this.checkEligibility(candidateDTO);

    if (candidateDTO.gender === Gender.MALE && !photo) throw new ValidationException("Photo is required");

    let loggedInCoordinator= await this.coordinatorService.findOne(id);
    if (loggedInCoordinator)
    id=loggedInCoordinator.institute.id || candidateDTO.instituteID;
    const institute: Institute = await this.instituteService.findOne(id)
    const category: Category = await this.categoryService.findOne(+candidateDTO.categoryID);
 
    if (!institute || !category) throw new ValidationException("Institute or Category can't be empty");
    let chestNO = await this.getchestNO(candidateDTO);
    candidateDTO.chestNO = chestNO;
    const newCandidate = this.candidateRepository.create(candidateDTO);
    newCandidate.category = category;
    newCandidate.institute = institute;
    newCandidate.session = category.session;

    const candidate: Candidate = await this.candidateRepository.save(newCandidate);

    return await this.uploadPhoto(candidate, photo);
  }

  async deleteCandidate(id: number) {
    try {
      let candidate = await this.findCandidateByID(id);
      await this.s3Service.deleteFile(candidate.photo);
      return this.candidateRepository.delete({ id });
    } catch (error) {
      throw error;
    }
  }
  async updateCandidate(id: number, payload: UpdateCandidateDTO, photo?: Express.Multer.File): Promise<boolean> {
    try {
      const candidate = await this.findCandidateByID(id);

      if (!candidate) throw new NotFoundException("Candidate not found");

      if (photo) {
        await this.s3Service.deleteFile(candidate.photo);
        await this.uploadPhoto(candidate, photo);
      }

      // TODO: Handle updated session, category and institute here

      await this.candidateRepository.save({ ...candidate, ...payload });

      return true;
    } catch (error) {
      throw error;
    }
  }

  private async getchestNO(candidateDTO: CandidateDTO): Promise<number> {
    try {
      let { categoryID } = candidateDTO;

      const category: Category = await this.categoryService.findOne(categoryID);

      if (!category) throw new NotFoundException("Category not found or inactive");

      const lastChestNoInTheCategory = await this.candidateRepository.createQueryBuilder('candidate')
        .leftJoinAndSelect('candidate.session', 'session')
        .leftJoinAndSelect('candidate.category', 'category')
        .where('session.id = :sessionID', { sessionID: category.session.id })
        .andWhere('category.id = :categoryID', { categoryID: category.id })
        .orderBy('candidate.chestNO', 'DESC')
        .getOne();

      return lastChestNoInTheCategory ? lastChestNoInTheCategory.chestNO + 1 : category.chestNoSeries;
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
        .andWhere('institute_id = :instituteID', { instituteID })
        .getOne();

      if (duplicate) {
        throw new ValidationException(
          'This candidate has already been registered',
        );
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  private async uploadPhoto(candidate: Candidate, photo: Express.Multer.File): Promise<Candidate> {
    try {
      if (!candidate || !photo) return;

      const ext: string = photo.originalname.split('.').pop();
      const uploadedImage: ManagedUpload.SendData = await this.s3Service.uploadFile(photo, `candidate-${candidate.id}.${ext}`);
      candidate.photo = {
        eTag: uploadedImage.ETag,
        key: uploadedImage.Key,
        url: uploadedImage.Location
      }

      return await this.candidateRepository.save(candidate);
    } catch (error) {
      throw error;
    }
  }
}
