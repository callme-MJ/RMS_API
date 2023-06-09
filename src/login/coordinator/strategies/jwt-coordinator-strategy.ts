import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Coordinator } from 'src/coordinator/entities/coordinator.entity';
import { IAuthenticate } from 'src/login/interfaces/authenticate.interface';
import { UserTypes } from 'src/login/interfaces/user-types.enum';
import { LoginService } from '../../login.service';

@Injectable()
export class JwtCoordinatorStrategy extends PassportStrategy(Strategy, 'jwt-coordinator') {
  constructor(private readonly loginService: LoginService,
    private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')
    });
  }

  async validate(payload: IAuthenticate) {
    const coordinator: Coordinator = await this.loginService.validateCoordinator(payload);
    if (!coordinator) {
      throw new UnauthorizedException();
    }

    return {
      id: coordinator.id,
      username: coordinator.username,
      type: UserTypes.COORDINATOR
    };
  }
}
