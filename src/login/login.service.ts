import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { AdminService } from 'src/admin/admin.service';
import { Admin } from 'src/admin/entities/admin.entity';
import { CoordinatorService } from 'src/coordinator/services/coordinator.service';
import { Coordinator } from 'src/coordinator/entities/coordinator.entity';
import { NotFoundException } from 'src/exceptions/not-found-exception';
import { ValidationException } from 'src/exceptions/validation-exception';
import { LoginDTO } from './dto/login.dto';
import { IAuthenticate } from './interfaces/authenticate.interface';
import { IAuthenticatedUser } from './interfaces/authenticated-user.interface';
import { ITokens } from './interfaces/tokens.interface';
import { UserTypes } from './interfaces/user-types.enum';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LoginService {
  constructor(
    private readonly adminService: AdminService,
    private readonly coordinatorService: CoordinatorService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) { }

  public async validateAdmin(payload: IAuthenticate): Promise<Admin> {
    try {
      return await this.adminService.findByUsername(payload.username);
    } catch (error) {
      throw error;
    }
  }


  public async validateCoordinator(payload: IAuthenticate): Promise<Coordinator> {
    try {
      return await this.coordinatorService.findByUsername(payload.username);
    } catch (error) {
      throw error;
    }
  }

  public async validateUser(payload:IAuthenticate):Promise<User>{
    try{
      return await this.userService.findByUsername(payload.username)
    }catch(error){
      throw error
    }
  }

  public async validate(
    credentials: IAuthenticate,
    type: UserTypes,
  ): Promise<IAuthenticatedUser> {
    try {
      let user;

      switch (type) {

        case UserTypes.ADMIN:
          user = await this.validateAdmin(credentials);
        break;

        case UserTypes.COORDINATOR:
          user = await this.validateCoordinator(credentials);
          break;

        case UserTypes.USER:
          user = await this.validateUser(credentials)
          break;

          default:
            throw new ValidationException("User's role is not valid");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async login(credentials: LoginDTO, type: UserTypes): Promise<ITokens> {
    try {
      const user = await this.validate(credentials, type);
      
      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      // const isPasswordCorrect = (credentials.password === user.password)
      const isPasswordCorrect = await bcrypt.compare(
        credentials.password,
        user.password,
      );
      if (!isPasswordCorrect) {
        throw new ValidationException('Invalid username or password');
      }

      return this.getTokens(user);
    } catch (error) {
      throw error;
    }
  }

  private async getUser(column: string, value: string, type: UserTypes) {
    try {
      switch (type) {
        case UserTypes.ADMIN:
          return this.adminService.findByColumn(column, value);

        case UserTypes.COORDINATOR:
          return this.coordinatorService.findByColumn(column, value);

          case UserTypes.USER:
            return this.userService.findByColumn(column,value);
        default:
          throw new ValidationException("Invalid user type");
      }
    } catch (error) {
      throw error;
    }
  }

  private getTokens(user: IAuthenticatedUser): ITokens {
    const payload = {
      id: user.id,
      username: user.username,
      type: user.type,
    };

    const options = {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('TTL'),
    };

    const refreshOptions = {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('REFRESH_TTL'),
    };

    const expiresInString = this.configService.get('TTL').split(' ');
    const expiresIn = moment().add(expiresInString[0], expiresInString[1]);

    return {
      access_token: this.jwtService.sign(payload, options),
      refresh_token: this.jwtService.sign(payload, refreshOptions),
      expires_in: expiresIn.valueOf(),
    };
  }

  public async regenerateTokens(refreshToken: string, type: UserTypes): Promise<ITokens> {
    try {
      const verifyToken = this.jwtService.verify(refreshToken, { secret: this.configService.get('JWT_SECRET') });
      
      if (!verifyToken) {
        throw new ValidationException('Invalid refresh token');
      }

      const userInfo: any = this.jwtService.decode(refreshToken);
      const user = await this.getUser('id', userInfo.id, type);

      if (!user) {
        throw new UnauthorizedException('User does not exist');
      }

      return this.getTokens({
        id: user.id,
        username: user.username,
        password: user.password,
        type,
      });

    } catch (error) {
      throw error;
    }
  }
}
