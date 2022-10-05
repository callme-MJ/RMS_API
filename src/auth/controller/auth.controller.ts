import { Controller,UseGuards, Request, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CordinAuthGuard, LocalAuthGuard } from '../utils/guards/local-authguards';
import { JwtGuard } from '../utils/guards/jwtGuard';
import { RolesGuard } from '../utils/guards/rolesGuards';
import { Roles } from '../utils/decorator';
import { Role } from '../entities/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('userlogin')
  userLogin(@Request()req):any {
    const user =this.authService.userLogin(req.user);
    return user;
  }
  @UseGuards(CordinAuthGuard)
  @Post('cordinatorlogin')
  cordinLogin(@Request()req):any {
    const cordin =this.authService.cordinLogin(req.user);
    return cordin;
  }

  
  @UseGuards(JwtGuard,RolesGuard)
  @Roles(Role.CONTROLLER,Role.ADMIN)
  @Get('dashboard')
  getDashboard(@Request() req:any) {
    return req.user
  }

  @UseGuards(JwtGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin')
  getpage(@Request()req:any){
    return 'welcome admin'
  }
  
  @UseGuards(JwtGuard)
  @Get('candidate/registration')
  getpages(@Request()req:any){
    return 'this is candidate registaration page'
  }
}
