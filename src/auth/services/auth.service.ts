import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { Coordinator } from '../entities/coordinator.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private userRepository:Repository<Users>, 
    @InjectRepository(Coordinator) private coordinatorRepo:Repository<Coordinator>,
    private jwtService:JwtService
  ){}

  async userLogin (user:any){
    const payload = {
      username:user.username,
      sub:user.id,
      role:user.role
    }
    return{
      access_token:this.jwtService.sign(payload)
    }
  }

  async cordinLogin (cordin:any){
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

  async findUser(username: string): Promise<Users> {
    return this.userRepository.findOneBy({ username });
}
  async findCordin(username: string): Promise<Coordinator> {
    return this.coordinatorRepo.findOneBy({ username });
}



  async getUserByUsername(username: string): Promise<any>{
    const user = this.userRepository.findOneBy({ username })
      return user;   
  }
    
 
}
