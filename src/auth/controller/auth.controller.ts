import { Controller,UseGuards, Request, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CordinAuthGuard, LocalAuthGuard } from '../utils/guards/local-authguards';
import { JwtGuard } from '../utils/guards/jwtGuard';
import { RolesGuard } from '../utils/guards/rolesGuards';
import { Roles } from '../decorators/roles.decorator'
import { Role } from '../enums/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('userlogin')
  userLogin(@Body()body:userAuthenticate) {
    return this.authService.userLogin(body);
  }

  @Post('cordinatorlogin')
  cordinLogin(@Body()body:cordinAuthenticate){
    return this.authService.cordinLogin(body);
  }

  @UseGuards(JwtGuard,RolesGuard)
  @Roles(Role.CONTROLLER,Role.ADMIN)
  @Get('loggedInUser')
  getDashboard(@Request() req:any) {
    return req.user
  }

  @UseGuards(JwtGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Get('loggedInAdmin')
  getpage(@Request()req:any){
   return  'welcome admin'
  }
  
  @UseGuards(JwtGuard)
  @Get('loggedInCoordinator')
  getpages(@Request()req:any){
    return 'this is candidate registaration page'
  }
}
