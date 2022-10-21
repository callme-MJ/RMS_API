import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Coordinator } from 'src/auth/entities/coordinator.entity';
import { DeleteResult, FindOptionsWhere, ObjectID, Repository } from 'typeorm';
import { CreateCoordinatorDto } from '../dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from '../dto/update-coordinator.dto';

@Injectable()
export class AdminCoordinatorService {

  constructor(
    @InjectRepository(Coordinator)
    private readonly cordinRepo:Repository<Coordinator>,
  ){}

  async create(createCordinDto: CreateCoordinatorDto):Promise<Coordinator> {
    const password = await this.encodePassword(createCordinDto.password)    
    const newCoordinator = this.cordinRepo.create({...createCordinDto,password })
    return await this.cordinRepo.save(newCoordinator);
  }

  async encodePassword (rawPassword:string){
    const SALT=  await bcrypt.genSalt(10);
    return await bcrypt.hash(rawPassword,SALT)
  }

  async findAllCoordinators():Promise<Coordinator[]> {

    return this.cordinRepo.find()
  }


  async update(id: number, updateCordinDto: UpdateCoordinatorDto) {
    if (updateCordinDto.password)
    {
      const password = await this.encodePassword(updateCordinDto.password)
      return  this.cordinRepo.update(id,{...updateCordinDto,password})
    }
    return this.cordinRepo.update(id,updateCordinDto)
  }

  async remove(id:number):Promise<DeleteResult> {
    return await this.cordinRepo.delete(id);
  }
}
