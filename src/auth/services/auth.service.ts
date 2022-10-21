import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { Coordinator } from '../entities/coordinator.entity';
import * as bcrypt from 'bcrypt'


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Coordinator) private coordinatorRepo: Repository<Coordinator>,
    private jwtService: JwtService
  ) { }

  async userLogin(user: UserAuthenticate) {
    const validatedUser = await this.validateUser(user)
    if (!validatedUser) {
      return 'user validation failed'
    }
    return this.getTokens(user)
  }

  async cordinLogin(cordin: CordinAuthenticate) {
    const validatedCordin = await this.validateCordin(cordin)
    if (!validatedCordin) {
      return 'cordinator validation failed'
    }
    return this.getTokens(cordin)
  }

  async validateUser(user: UserAuthenticate) {
    const isuser = await this.findUser(user.username)
    const isPasswordMatching = await bcrypt.compare(user.password, isuser.password);
    if (isuser && isPasswordMatching) {
      const { password, ...rest } = user;
      return rest;
    } else
      return null
  }

  async validateCordin(cordin: CordinAuthenticate) {
    const iscordin = await this.findCordin(cordin.username)
    const isPasswordMatching = await bcrypt.compare(cordin.password, iscordin.password);
    if (iscordin && isPasswordMatching) {
      const { password, ...data } = cordin;
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

  async getTokens(user: any) {
    const payload: JwtPayload = {
      username: user.username,
      id: user.id,
      role: user.role
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

  async refreshToken(username: string, refreshToken: string) {
    const decoded = this.jwtService.decode(refreshToken);
    if (!username || !refreshToken)
      throw new ForbiddenException('Token not found');
    const user = await this.findUser(username)
    const cordin = await this.findCordin(username)
    return await this.getTokens(user ? user : cordin)
  }

}
