import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/auth.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private userRepository:Repository<Users>, 
    private jwtService:JwtService
  ){}

  async login (user:any){
    const payload = {
      username:user.username,
      sub:user.id,
      role:user.role
    }
    return{
      access_token:this.jwtService.sign(payload)
    }
  }


  async validateUser(username: string, password:string):Promise<any>{
    const user = await this.findOne(username)
    if (user && user.password === password) {
      const {password,...rest} = user;
      return rest;
    }
    return null
  }

  async findOne(username: string): Promise<Users> {
    return this.userRepository.findOneBy({ username });
}

  async getById(id: number): Promise<Users> {
    const user = this.userRepository.findOneBy({ id })
    return user;

  

  }
}
