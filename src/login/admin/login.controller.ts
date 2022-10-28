import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from 'src/admin/admin.service';
import { LoginDTO } from '../dto/login.dto';
import { RefreshTokenDTO } from '../dto/refresh-token.dto';
import { UserTypes } from '../interfaces/user-types.enum';
import { LoginService } from '../login.service';

@Controller('admin')
export class AdminLoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly adminService: AdminService,
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
  @UseGuards(AuthGuard('jwt-admin'))
  @Get('me')
  async findOne(@Request() req: any) {
    try { return await this.adminService.findByID(req.user.id); }
    catch (error) {
      throw error
    }
  }
}
