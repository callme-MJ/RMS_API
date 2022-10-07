import { Injectable,UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "src/auth/services/auth.service";

@Injectable()
export class LocalUsersStrategy extends PassportStrategy(Strategy,'users'){
    constructor (private authService:AuthService){
        super();
    }

    async validate(username: string, password:string):Promise<any>{
        const user = await this.authService.validateUser(username, password)
    if (!user) {
        throw new UnauthorizedException("no user");
    }
    return user;
    }
}