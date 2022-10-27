import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { LoginDTO } from "src/login/dto/login.dto";
import { RefreshTokenDTO } from "src/login/dto/refresh-token.dto";
import { UserTypes } from "src/login/interfaces/user-types.enum";
import { LoginService } from "src/login/login.service";
import { UserService } from "src/user/user.service";

@Controller('user')
export class UserLoginController{
  constructor(
    private readonly loginService:LoginService,
    private readonly userService:UserService
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
  @UseGuards(AuthGuard('jwt-user'))
  @Get('me')
  async findOne(@Request() req: any) {
    try { return await this.userService.findOne(req.user.id); }
    catch (error) {
      throw error
    }
  }
}