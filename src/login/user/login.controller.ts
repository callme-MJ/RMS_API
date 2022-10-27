import { Body, Controller, Post } from "@nestjs/common";
import { LoginDTO } from "src/login/dto/login.dto";
import { RefreshTokenDTO } from "src/login/dto/refresh-token.dto";
import { UserTypes } from "src/login/interfaces/user-types.enum";
import { LoginService } from "src/login/login.service";

@Controller('user')
export class UserLoginController{
  constructor(
    private readonly loginService:LoginService
  ){}

  @Post('login')
  public async login(@Body() body:LoginDTO){
    try{
      return await this.loginService.login(body,UserTypes.USER)
    }catch(error){
      throw error
    }
  }

  @Post('refresh-token')
  public async refreshToken(@Body() payload: RefreshTokenDTO) {
    try {
      return await this.loginService.regenerateTokens(
        payload.refreshToken,
        UserTypes.USER,
      );
    } catch (error) {
      throw error;
    }
  }
}