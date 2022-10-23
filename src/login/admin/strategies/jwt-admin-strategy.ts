import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Admin } from 'src/admin/entities/admin.entity';
import { IAuthenticate } from 'src/login/interfaces/authenticate.interface';
import { UserTypes } from 'src/login/interfaces/user-types.enum';
import { LoginService } from '../../login.service';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(private readonly loginService: LoginService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: IAuthenticate) {
    const admin: Admin = await this.loginService.validateAdmin(payload);
    if (!admin) {
      throw new UnauthorizedException();
    }

    return {
      id: admin.id,
      username: admin.username,
      type: UserTypes.ADMIN
    };
  }
}
