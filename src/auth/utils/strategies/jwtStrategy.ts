import { Injectable } from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport'
import { AuthService } from 'src/auth/services/auth.service';
import {ExtractJwt, Strategy} from 'passport-jwt'



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){

    constructor(private readonly authService:AuthService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ingoreExpiration:false,
            secretOrKey:'sec'
        })
    }
    async validate(payload:any){
        const user = await this.authService.getById(payload.sub)
       
            if (user.role===1) {
                return{
                    id:payload.sub,
                    username:payload.username,
                    role:'admin'
                    
                } 
            }
            else if (user.role===2) return{
                id:payload.sub,
                username:payload.username,
                role:'controller'
                
            }
        
    }
}