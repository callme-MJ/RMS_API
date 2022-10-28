import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAuthenticate } from 'src/login/interfaces/authenticate.interface';
import { UserTypes } from 'src/login/interfaces/user-types.enum';
import { User } from 'src/user/entities/user.entity';
import { LoginService } from '../../login.service';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor(private readonly loginService: LoginService,
    private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')
    });
  }

  async validate(payload: IAuthenticate) {
    const user: User = await this.loginService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      username: user.username,
      type: UserTypes.USER,
      role: user.role
    };
  }
}
