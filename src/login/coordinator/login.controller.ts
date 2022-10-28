import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoordinatorService } from 'src/coordinator/services/coordinator.service';
import { LoginDTO } from '../dto/login.dto';
import { RefreshTokenDTO } from '../dto/refresh-token.dto';
import { UserTypes } from '../interfaces/user-types.enum';
import { LoginService } from '../login.service';

@Controller('coordinator')
export class CoordinatorLoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly coordinatorService: CoordinatorService,
  ) { }

  @Post('login')
  public async login(@Body() body: LoginDTO) {
    try {
      return await this.loginService.login(body, UserTypes.COORDINATOR);
    } catch (error) {
      throw error;
    }
  }

  @Post('refresh-token')
  public async refreshToken(@Body() payload: RefreshTokenDTO) {
    try {
      return await this.loginService.regenerateTokens(
        payload.refreshToken,
        UserTypes.COORDINATOR,
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt-coordinator'))
  @Get('me')
  async findOne(@Request() req: any) {
    try { return await this.coordinatorService.findOne(req.user.id); }
    catch (error) {
      throw error
    }
  }
}
