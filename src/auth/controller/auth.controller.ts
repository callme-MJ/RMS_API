import { Controller, UseGuards, Request, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/roles.enum';
import { AuthService } from '../services/auth.service';
import { JwtGuard } from '../utils/guards/jwt.guard';
import { RolesGuard } from '../utils/guards/roles.guards';
import { RTGuard } from '../utils/guards/RT.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('userlogin')
  userLogin(@Body() body: UserAuthenticate) {
    console.log(body)
    return this.authService.userLogin(body);
  }

  @Post('cordinatorlogin')
  cordinLogin(@Body() body: CordinAuthenticate) {
    return this.authService.cordinLogin(body);
  }

  @UseGuards(RTGuard)
  @Get('refresh')
  refresh(@Request() req: any) {
    return this.authService.refreshToken(req.user['username'], req.user['refreshToken'])
    
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.CONTROLLER, Role.ADMIN)
  @Get('loggedInUser')
  getDashboard(@Request() req: any) {
    return req.user
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('loggedInAdmin')
  getpage(@Request() req: any) {
    return 'welcome admin'
  }

  @UseGuards(JwtGuard)
  // @Roles(Role.COORDINATOR)
  @Get('loggedInCoordinator')
  getpages(@Request() req: any) {
    return req.user
  }
}
