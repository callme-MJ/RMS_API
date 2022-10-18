import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { Coordinator } from '../entities/coordinator.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository:Repository<User>, 
    @InjectRepository(Coordinator) private coordinatorRepo:Repository<Coordinator>,
    private jwtService:JwtService
  ){}

  async userLogin (user:User){
    const payload = {
      username:user.username,
      sub:user.id,
      role:user.role
    }
    return{
      access_token:this.jwtService.sign(payload)
    }
  }

  async cordinLogin (cordin:Coordinator){
    const payload = {
      username:cordin.username,
      sub:cordin.id,
    }
    
    return{
      access_token:this.jwtService.sign(payload)
    }
  }


  async validateUser(username: string, password:string):Promise<any>{
    const user = await this.findUser(username)
    if (user && user.password === password) {
      const {password,...rest} = user;
      return rest;
    }
    return null
    
  }
  async validateCordin(username: string, password:string):Promise<any>{
    const cordin = await this.findCordin(username)
    
    if (cordin && cordin.password === password) {
      const {password,...data} = cordin;
      
      return data;
    }
    return null
    
  }

  async findUser(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
}
  async findCordin(username: string): Promise<Coordinator> {
    return this.coordinatorRepo.findOneBy({ username });
}
}
