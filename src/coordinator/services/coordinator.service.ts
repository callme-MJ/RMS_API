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
import { Institute } from 'src/institute/entities/institute.entity';
import { InstituteService } from 'src/institute/institute.service';
import { Session, SessionStatus } from 'src/session/entities/session.entity';
import { SessionService } from 'src/session/session.service';
import { IFilter } from 'src/candidate/interfaces/filter.interface';
import { Admin } from 'src/admin/entities/admin.entity';
import { AdminService } from 'src/admin/admin.service';

export interface ICoordinatorFilter extends IFilter{
  sessionID : number
}

@Injectable()
export class CoordinatorService {
  constructor(
    @InjectRepository(Coordinator)
    private readonly coordinatorRepo: Repository<Coordinator>,
    private readonly s3Service: S3Service,
    private readonly instituteService: InstituteService,
    private readonly sessionService: SessionService,
    private readonly adminService: AdminService
  ) {}

async  createCoordinator(
    createCoordinatorDto: CreateCoordinatorDto,
    photo: Express.Multer.File,):Promise<boolean> {  

      const institute:Institute = await this.instituteService.findOne(createCoordinatorDto.instituteID);
      const password = await this.encodePassword(createCoordinatorDto.password)    
      const newCoordinator = this.coordinatorRepo.create({...createCoordinatorDto,password});
      newCoordinator.institute = institute;      
      newCoordinator.session = institute.session;
      const isUsernameAvailable = await this.usernameAvailabilityCheck(createCoordinatorDto.username);
      if (isUsernameAvailable=== false) throw new ValidationException('User name not Available')
      const coordinator: Coordinator = await this.coordinatorRepo.save(newCoordinator);
      if (photo) {
        await this.uploadPhoto(coordinator, photo);
      }
      return true
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
      await this.coordinatorRepo.save(coordinator);
      return 
    } catch (error) {
      throw error;
    }
  }

  
    public async findAll(queryParams:ICoordinatorFilter): Promise<Coordinator[]> {
    try {
      return this.coordinatorRepo.find({
        where: {
          session: {
            id: queryParams.sessionID,
            status: SessionStatus.ACTIVE
          }
        }
      });
      
    } catch (error) {
      throw error;
    }
  };
  

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

  async updateCoordinator(id: number, updateData: UpdateCoordinatorDto, file?: Express.Multer.File) {
    try{
      const coordinator = await this.findOne(id);
      if (!coordinator) throw new NotFoundException("Coordinator not found");

      if(file) {
        await this.s3Service.deleteFile(coordinator.photo);
        await this.uploadPhoto( coordinator, file);
      }
      if (updateData.password)
      updateData.password = await this.encodePassword(updateData.password)

      await this.coordinatorRepo.save({...coordinator,...updateData})
      return true;
    }catch(error){
      throw error;
    }
    }
    
   async remove(id: number) {
    try{
      const coordinator = await this.findOne(id);
      if (!coordinator) throw new NotFoundException("Coordinator not found");
      await this.s3Service.deleteFile(coordinator.photo);
      this.coordinatorRepo.delete(id);
      return true; 
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

  async usernameAvailabilityCheck(username: string): Promise<boolean> {
    const availableFromAdmin = await this.adminService.findByUsername(username)    
    const availability = await this.coordinatorRepo
    .createQueryBuilder('coordinator')
    .leftJoinAndSelect('coordinator.session', 'session')
    // .leftJoinAndSelect('session.institutes', 'institute')
    // .leftJoinAndSelect('institute.candidates', 'candidate')
    // to check whether the username is taken by candidates, since candidates doesn't hold a username its unwanted
    
    // .leftJoinAndSelect('session.user' , 'user')
    // to check whether the username is taken by user, since user isn't found its a TODO
    
    .select('coordinator.id')
    .andWhere('coordinator.username= :username', { username })
    .getCount();
    if (availability ||availableFromAdmin ) return false;     
    return true;}
    
    
}
