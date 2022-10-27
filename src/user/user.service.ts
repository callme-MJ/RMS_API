import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepo:Repository<User>,
  ){}
async  createUser(createUserDto: CreateUserDto) {
    const password = await this.encodePassword(createUserDto.password)
    const newUser = this.userRepo.create({...createUserDto,password})
    await this.userRepo.save(newUser);
    return true;
  }

  findAll():Promise <User[]> {
    try{
      return this.userRepo.find()
    }catch(error){
      throw error
    }
  }

  findOne(id: number) {
    return this.userRepo.findOneBy({id});
  }

  async update(id: number, updateUserDto: UpdateUserDto) 
  {
  try{
    if (updateUserDto.password) {
      const password = await this.encodePassword(updateUserDto.password)
      return this.userRepo.update(id,{...updateUserDto,password})
    }
      return this.userRepo.update(id,updateUserDto)
    }catch(error){
    throw error
  }
}

  remove(id: number):Promise<DeleteResult> {
    try{
      return this.userRepo.delete(id)
    }catch(error){
      throw error
  }
}

  async encodePassword(rawPassword: string) {
    const SALT = await bcrypt.genSalt(10);
    return await bcrypt.hash(rawPassword, SALT)
  }

  public async findByColumn(column: string, value: string): Promise<User> {
    try {
      return this.userRepo.findOne({
        where: {
          [column]: value
        }
      });
    } catch (error) {
      throw error;
    }
  }

  public async findByUsername(username:string):Promise<User>{
    try{
      return this.userRepo.findOneBy({username})
    }catch(error){
      throw error
    }
  }

}
