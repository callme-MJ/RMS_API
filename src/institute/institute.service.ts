import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { S3Service } from 'src/candidate/services/s3.service';
import { NotFoundException } from 'src/exceptions/not-found-exception';
import { ValidationException } from 'src/exceptions/validation-exception';
import { Session, SessionStatus } from 'src/session/entities/session.entity';
import { SessionService } from 'src/session/session.service';
import { Repository } from 'typeorm';
import { CreateInstituteDTO } from './dto/create-institute.dto';
import { UpdateInstituteDTO } from './dto/update-institute.dto';
import { Institute } from './entities/institute.entity';

@Injectable()
export class InstituteService {
  constructor(
    @InjectRepository(Institute)
    private readonly instituteRepository: Repository<Institute>,
    private readonly sessionService: SessionService,
    private readonly s3Service: S3Service
  ) { }

  public async create(payload: CreateInstituteDTO, coverPhoto: Express.Multer.File): Promise<Institute> {
    try {
      const session: Session = await this.sessionService.findByID(payload.sessionID);

      if(!coverPhoto) throw new ValidationException("Cover photo is required");

      const institute: Institute = await this.instituteRepository.save({ ...payload, session });
      
      return await this.uploadPhoto(institute, coverPhoto);
    } catch (error) {
      throw error;
    }
  }

  public async findAll(sessionID: number = 0): Promise<Institute[]> {
    try {
      return this.instituteRepository.find({
        where: {
          session: {
            id: sessionID,
            status: SessionStatus.ACTIVE
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }

  

  public async findOne(id: number): Promise<Institute> {
    try {
      const institute: Institute = await this.instituteRepository.findOne({
        where: { id }
      });

      if(!institute) throw new NotFoundException("Institute not found");

      if(!institute.session || !institute.session.status) return null;

      return institute;
    } catch (error) {
      throw error;
    }
  }

  public async update(id: number, payload: UpdateInstituteDTO, coverPhoto?: Express.Multer.File): Promise<boolean> {
    try {
      const session: Session = await this.sessionService.findByID(payload.sessionID);
      const institute: Institute = await this.findOne(id);

      if(!institute) throw new NotFoundException("Institute not found");

      if(coverPhoto) {
        await this.s3Service.deleteFile(institute.coverPhoto);
        await this.uploadPhoto(institute, coverPhoto);
      }

      await this.instituteRepository.save({ ...payload, id, session });
      return true;
    } catch (error) {
      throw error;
    }
  }

  public async remove(id: number) {
    try {
      const institute: Institute = await this.findOne(id);
      await this.s3Service.deleteFile(institute.coverPhoto);
      await this.instituteRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  private async uploadPhoto(institute: Institute, coverPhoto: Express.Multer.File) : Promise<Institute> {
    try {
      if(!institute || !coverPhoto) return;     

      const ext: string = coverPhoto.originalname.split('.').pop();
      const uploadedImage: ManagedUpload.SendData = await this.s3Service.uploadFile(coverPhoto, `institute-${institute.id}.${ext}`);
      institute.coverPhoto = {
        eTag: uploadedImage.ETag,
        key: uploadedImage.Key,
        url: uploadedImage.Location
      }
      
      return await this.instituteRepository.save(institute);
    } catch (error) {
      throw error;
    }
  }
}
