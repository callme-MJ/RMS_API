import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCoordinatorDto } from '../dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from '../dto/update-coordinator.dto';
import { Coordinator } from '../entities/coordinator.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { S3Service } from 'src/candidate/services/s3.service';
import { ValidationException } from 'src/exceptions/validation-exception';
import { NotFoundException } from 'src/exceptions/not-found-exception';

@Injectable()
export class CoordinatorService {
  constructor(
    @InjectRepository(Coordinator)
    private readonly coordinatorRepo: Repository<Coordinator>,
    private readonly s3Service: S3Service,
) { }

async  createCandidate(
    createCoordinatorDto: CreateCoordinatorDto,
    photo: Express.Multer.File,):Promise<Coordinator> {
      if(!photo) throw new ValidationException("Photo is required");
      const password = await this.encodePassword(createCoordinatorDto.password)    
      const newCoordinator = this.coordinatorRepo.create({...createCoordinatorDto,password});
      const coordinator: Coordinator = await this.coordinatorRepo.save(newCoordinator);

    return await this.uploadPhoto(coordinator, photo);
  }

  private async uploadPhoto(coordinator: Coordinator, photo: Express.Multer.File) : Promise<Coordinator> {
    try {
      if(!coordinator || !photo) return;      
      const ext: string = photo.originalname.split('.').pop();
      const uploadedImage: ManagedUpload.SendData = await this.s3Service.uploadFile(photo, `coordinator-${coordinator.id}.${ext}`);
      coordinator.photo = {
        eTag: uploadedImage.ETag,
        key: uploadedImage.Key,
        url: uploadedImage.Location
      }
      return await this.coordinatorRepo.save(coordinator);
    } catch (error) {
      throw error;
    }
  }

  findAll( ) {
    return this.coordinatorRepo.find();
  }

  public async findByUsername(username: string): Promise<Coordinator> {
    try {
        return this.coordinatorRepo.findOne({
            where: { username }
        });
    } catch (error) {
        throw error;
    }
}

  findOne(id: number) {
    try{
      return this.coordinatorRepo.findOneBy({id})
    }catch(error){
      throw error
    }
  }

  async updateCoordinator(id: number, updateCoordinatordto: UpdateCoordinatorDto, photo?: Express.Multer.File) {
    try{
      const coordinator = await this.findOne(id);
      if (!coordinator) throw new NotFoundException("Coordinator not found");

      if(photo) {
        await this.s3Service.deleteFile(coordinator.photo);
        await this.uploadPhoto(coordinator, photo);
      }
      if (updateCoordinatordto.password)
      updateCoordinatordto.password = await this.encodePassword(updateCoordinatordto.password)
      
      return this.coordinatorRepo.update(id,updateCoordinatordto)
    }catch(error){
      throw error;
    }
    }
    
   async remove(id: number) {
    try{
      const coordinator = await this.findOne(id);
      if (!coordinator) throw new NotFoundException("Coordinator not found");
      await this.s3Service.deleteFile(coordinator.photo);
      return this.coordinatorRepo.delete(id);
    }catch(error){
      throw error
    }
  }

  public async findByColumn(column: string, value: string): Promise<Coordinator> {
    try {
        return this.coordinatorRepo.findOne({
            where: {
                [column]: value
            }
        });
    } catch (error) {
        throw error;
    }
}

  async encodePassword (rawPassword:string){
    const SALT=  await bcrypt.genSalt(10);
    return await bcrypt.hash(rawPassword,SALT)
  }
}
