import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from '../dto/login.dto';
import { RefreshTokenDTO } from '../dto/refresh-token.dto';
import { UserTypes } from '../interfaces/user-types.enum';
import { LoginService } from '../login.service';

@Controller('admin')
export class AdminLoginController {
  constructor(
    private readonly loginService: LoginService
  ) { }

  @Post('login')
  public async login(@Body() body: LoginDTO) {
    try {
      return await this.loginService.login(body, UserTypes.ADMIN);
    } catch (error) {
      throw error;
    }
  }

  @Post('refresh-token')
  public async refreshToken(@Body() payload: RefreshTokenDTO) {
    try {
      return await this.loginService.regenerateTokens(
        payload.refreshToken,
        UserTypes.ADMIN,
      );
    } catch (error) {
      throw error;
    }
  }
}
