import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from 'src/auth/entities/users.entity';
import { UpdateUserDto } from '../dto/update-user.dto';


@Injectable()
export class AdminUserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo:Repository<User>,
  ){}

  async createUser(createuserdto: CreateUserDto):Promise<User> {
    const password = await this.encodePassword(createuserdto.password)    
    const newUser = this.userRepo.create({...createuserdto,password })
    return await this.userRepo.save(newUser);
  }

  async encodePassword (rawPassword:string){
    const SALT=  await bcrypt.genSalt(10);
    return await bcrypt.hash(rawPassword,SALT)
  }

  async findAllUsers():Promise<User[]> {

    return this.userRepo.find()
  }


  async updateUser(id: number, updateuserdto: UpdateUserDto) {
    if (updateuserdto.password)
    {
      const password = await this.encodePassword(updateuserdto.password)
      return  this.userRepo.update(id,{...updateuserdto,password})
    }
    return this.userRepo.update(id,updateuserdto)
  }

  async removeUser(id:number):Promise<DeleteResult> {
    return await this.userRepo.delete(id);
  }
}
