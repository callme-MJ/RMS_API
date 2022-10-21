import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from 'src/auth/services/auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(private readonly authService: AuthService,
        private readonly configService:ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ingoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_PASSWORD')
        })
    }
    async validate(payload: any) {

        const user = await this.authService.findUser(payload.username)
        const cordin = await this.authService.findCordin(payload.username)
        
        if (user) {
            if (user.role === 1) {
                return {
                    id: user.id,
                    username: user.username,
                    role: 'admin'
                }
            }
            if (user.role === 2) {
                return {
                    id: user.id,
                    username: user.username,
                    role: 'controller'
                }
            }
            if (user.role === 3) {
                return {
                    id: user.id,
                    username: user.username,
                    role: 'media'
                }
            }
        }          
        else return{
            id:cordin.id,
            username:cordin.username,
            role:'coordinator'
        } 
    }
}