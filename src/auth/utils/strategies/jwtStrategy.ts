import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from 'src/auth/services/auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt'



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ingoreExpiration: false,
            secretOrKey: 'sec'
        })
    }
    async validate(payload: any) {
        const user = await this.authService.getUserByUsername(payload.username)
        const cordin = await this.authService.findCordin(payload.username)
        if (user) {

            if (user.role === 2) {
                return {
                    id: user.id,
                    username: user.username,
                    role: 'controller'

                }
            }
            if (user.role === 1) {
                return {
                    id: user.id,
                    username: user.username,
                    role: 'admin'
                }
            }
        }

        else return cordin;
            



    }
}