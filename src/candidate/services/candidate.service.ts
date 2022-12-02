import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { name } from 'aws-sdk/clients/importexport';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { CandidateProgram } from 'src/candidate-program/entities/candidate-program.entity';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { CoordinatorService } from 'src/coordinator/services/coordinator.service';
import { NotFoundException } from 'src/exceptions/not-found-exception';
import { ValidationException } from 'src/exceptions/validation-exception';
import { Institute } from 'src/institute/entities/institute.entity';
import { InstituteService } from 'src/institute/institute.service';
import { Session } from 'src/session/entities/session.entity';
import { SessionService } from 'src/session/session.service';
import { Repository } from 'typeorm';
import { CandidateDTO } from '../dtos/candidate.dto';
import { UpdateCandidateDTO } from '../dtos/update-candidate.dto';
import { Candidate, Gender } from '../entities/candidate.entity';
import { Details } from '../entities/export.class';
import { IFilter } from '../interfaces/filter.interface';
import { S3Service } from './s3.service';

export interface ICandidateFilter extends IFilter {
  instituteID: number;
  sessionID: number;
}

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(CandidateProgram)
    private readonly candidateProgramRepo:Repository<CandidateProgram>,
    private coordinatorService: CoordinatorService,
    private readonly s3Service: S3Service,
    private readonly instituteService: InstituteService,
    private readonly categoryService: CategoryService,
  ) {}

  async findAllCandidates(
    queryParams: ICandidateFilter,
  ): Promise<{ candidates: Candidate[]; count: number }> {
    try {
      const candidatesQuery =
        this.candidateRepository.createQueryBuilder('candidates');

      const search = queryParams.search;
      const sort = queryParams.sort;
      const page = queryParams.page || 1;

      if (search) {
        candidatesQuery.where('name LIKE :search OR chestNO LIKE :search', {
          search: `%${search}%`,
        });
      }

      if (queryParams.instituteID) {
        candidatesQuery.andWhere('institute_id = :instituteID', {
          instituteID: queryParams.instituteID,
        });
      }

      if (sort) {
        candidatesQuery.orderBy('candidates.name', sort).getMany();
      }

      const perPage = queryParams.perPage || 15;
      candidatesQuery.offset((page - 1) * perPage).limit(perPage);

      const [candidates, count] = await candidatesQuery
        .where('candidates.session_id = :sessionID', {
          sessionID: queryParams.sessionID,
        })
        .getManyAndCount();

      return { candidates, count };
    } catch (error) {
      throw error;
    }
  }

  async findAllCandidatesOfInstitute(
    id: number,
    queryParams: ICandidateFilter,
  ): Promise<{ candidates: Candidate[]; count: number }> {
    try {
      const loggedInCoordinator = await this.coordinatorService.findOne(id);
      const candidatesQuery =
        this.candidateRepository.createQueryBuilder('candidates');

      const search = queryParams.search;
      const sort = queryParams.sort;
      const page = queryParams.page || 1;

      if (search) {
        candidatesQuery.where('name LIKE :search OR chestNO LIKE :search', {
          search: `%${search}%`,
        });
      }

      if (queryParams.instituteID) {
        candidatesQuery.andWhere('institute_id = :institueID', {
          institueID: queryParams.instituteID,
        });
      }

      if (sort) {
        candidatesQuery.orderBy('candidates.name', sort).getMany();
      }

      const perPage = queryParams.perPage || 15;
      candidatesQuery.offset((page - 1) * perPage).limit(perPage);

      let candidates = await this.candidateRepository
        .createQueryBuilder('candidates')
        .where('candidates.institute_id = :instituteID', {
          instituteID: loggedInCoordinator.institute.id || id,
        })
        .getMany();
      return { candidates, count: candidates.length };
    } catch (error) {
      throw error;
    }
  }

  findCandidateByID(id: number): Promise<Candidate> {
    try {
      return this.candidateRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  findCandidateBychestNO(
    chestNo: number,
    sessionID?: number,
  ): Promise<Candidate> {
    try {
      return this.candidateRepository.findOne({
        where:{
          chestNO: chestNo,
          session: { id: sessionID },
        }
      });
    } catch (error) {
      throw error;
    }
  }

  findCandidateByInstituteID(id: number): Promise<Candidate[]> {
    try {
      return this.candidateRepository.find({
        where: { institute: { id } },
      });
    } catch (error) {
      throw error;
    }
  }

  async createCandidate(
    candidateDTO: CandidateDTO,
    photo: Express.Multer.File,
    id?: number,
  ): Promise<Candidate> {
    if (candidateDTO.gender === Gender.MALE && !photo)
      throw new ValidationException('Photo is required');

    let loggedInCoordinator = await this.coordinatorService.findOne(id);
    if (loggedInCoordinator)
      id = loggedInCoordinator.institute.id || candidateDTO.instituteID;
    candidateDTO.instituteID = id;
    await this.checkEligibility(candidateDTO);
    const institute: Institute = await this.instituteService.findOne(id);
    const category: Category = await this.categoryService.findOne(
      +candidateDTO.categoryID,
    );

    if (!institute || !category)
      throw new ValidationException("Institute or Category can't be empty");
    let chestNO = await this.getchestNO(candidateDTO);
    const newCandidate = this.candidateRepository.create(candidateDTO);
    newCandidate.chestNO = chestNO;
    newCandidate.category = category;
    newCandidate.institute = institute;
    newCandidate.session = category.session;

    const candidate: Candidate = await this.candidateRepository.save(
      newCandidate,
    );

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
  async updateCandidate(
    id: number,
    payload: UpdateCandidateDTO,
    photo?: Express.Multer.File,
  ): Promise<boolean> {
    try {
      const candidate = await this.findCandidateByID(id);

      if (!candidate) throw new NotFoundException('Candidate not found');

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

      if (!category)
        throw new NotFoundException('Category not found or inactive');

      const lastChestNoInTheCategory = await this.candidateRepository
        .createQueryBuilder('candidate')
        .leftJoinAndSelect('candidate.session', 'session')
        .leftJoinAndSelect('candidate.category', 'category')
        .where('session.id = :sessionID', { sessionID: category.session.id })
        .andWhere('category.id = :categoryID', { categoryID: category.id })
        .orderBy('candidate.chestNO', 'DESC')
        .getOne();

      return lastChestNoInTheCategory
        ? lastChestNoInTheCategory.chestNO + 1
        : category.chestNoSeries;
    } catch (error) {
      throw error;
    }
  }

  async checkEligibility(candidateDTO: CandidateDTO) {
    try {
      let { adno, instituteID } = candidateDTO;
      let duplicate = await this.candidateRepository.find({
        relations: {
          institute: true,
        },
        where: {
          institute: {
            id: instituteID,
          },
          adno: adno,
        },
      });
      // let duplicate = await this.candidateRepository.createQueryBuilder('candidates')
      // .where('institute_id = :instituteID', { instituteID})
      //.andWhere('adno = :adno', { adno })
      //.getOne();
      //console.log(duplicate);
      if (duplicate.length > 0) {
        throw new ValidationException(
          'This candidate has already been registered',
        );
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  private async uploadPhoto(
    candidate: Candidate,
    photo: Express.Multer.File,
  ): Promise<Candidate> {
    try {
      if (!candidate || !photo) return;

      const ext: string = photo.originalname.split('.').pop();
      const uploadedImage: ManagedUpload.SendData =
        await this.s3Service.uploadFile(
          photo,
          `candidate-${candidate.id}.${ext}`,
        );
      candidate.photo = {
        eTag: uploadedImage.ETag,
        key: uploadedImage.Key,
        url: uploadedImage.Location,
      };

      return await this.candidateRepository.save(candidate);
    } catch (error) {
      throw error;
    }
  }

  async findCandidateDetails(chestNo:number){
   const candidate = await this.candidateRepository.
   createQueryBuilder('candidate')
   .leftJoinAndSelect('candidate.category', 'category')
   .leftJoinAndSelect('candidate.institute', 'institute')
   .where('candidate.chestNO = :chestNo', {chestNo})
   .select(['candidate.id', 'candidate.name','candidate.chestNO', 'candidate.photo', 'category.name', 'institute.shortName','candidate.gender'])
   .getRawMany();
       
   const program = await this.candidateProgramRepo
   .createQueryBuilder('candidateProgram')
   .where('candidateProgram.chest_no=:chestNo',{chestNo:chestNo})
   .leftJoinAndSelect('candidateProgram.program','program')
   .select('program.name','name')
   .addSelect('program.program_code','code')
   .addSelect('program.date','date')
   .addSelect('program.final_result_entered','entered')
   .addSelect('program.final_result_published','published')
   .addSelect('program.type','type')
   .addSelect('program.skill','skill')
   .addSelect('program.s_time','time')
   .addSelect('program.venue','venue')
   .getRawMany()

   const result = await this.candidateProgramRepo
   .createQueryBuilder('candidateProgram')
   .leftJoinAndSelect('candidateProgram.program','program')
   .where('candidateProgram.chest_no=:chestNo',{chestNo:chestNo})
   .andWhere('program.final_result_published = :published',{published:"true"})
   .select('candidateProgram.point',"mark")
   .addSelect('program.name','name')
   .addSelect('candidateProgram.position','position')
   .addSelect('candidateProgram.grade','grade')
   .getRawMany()

   const programDetails = program.map((item)=>{item.result = result.find((res)=>res.name == item.name); return item})    

   const details: Details = {
     name: candidate[0].candidate_name,
     chestNO: candidate[0].candidate_chestNO,
     photo: candidate[0].candidate_photo,
     gender: candidate[0].candidate_gender,
     institute: candidate[0].institute_short_name,
     category: candidate[0].category_name,
    program:[...programDetails]
   }
    return details;
    
  }
}