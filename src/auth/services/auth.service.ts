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

  async userLogin (user:userAuthenticate){
    const validatedUser = await this.validateUser(user)
    if (!validatedUser) {       
      return 'user validation failed'
    }
        const tokens = this.getTokens(user)
        return tokens
  }

  async cordinLogin (cordin:cordinAuthenticate){
    const validatedCordin = await this.validateCordin(cordin)
   if (!validatedCordin) {
    return 'cordinator validation failed'
   }
    const tokens = this.getTokens(cordin)
    return tokens;
  }

  async validateUser(user:userAuthenticate){
    const isuser = await this.findUser(user.username)    
    if (isuser && isuser.password === user.password) {
      const {password,...rest} = user;
      return rest;
    }else
    return null
  }
  
  async validateCordin(cordin:cordinAuthenticate){
    const iscordin = await this.findCordin(cordin.username) 
    if (iscordin && iscordin.password === cordin.password) {
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

async getTokens(user:any)  {
  const  payload: jwtPayload = {
    username:user.username,
    id:user.id,
    role:user.role
  }
   const [at, rt] = await Promise.all([
    this.jwtService.signAsync(payload, {
      secret: 'sec',
      expiresIn: '900s',
    }),
    this.jwtService.signAsync(payload, {
      secret: 'sec2',
      expiresIn: '1d',
    }),
  ]);

  return {
    access_token: at,
    refresh_token: rt,
  };
}

}
