import { Injectable,UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "src/auth/services/auth.service";

@Injectable()
export class LocalCordinStrategy extends PassportStrategy(Strategy,'coordinator'){
    constructor (private authService:AuthService){
        super();
    }

    async validate(username: string, password:string):Promise<any>{
        const cordin = await this.authService.validateCordin(username, password)
        
    if (!cordin) {
        throw new UnauthorizedException("no cordinator");
    }
    return cordin;
    
    }
}