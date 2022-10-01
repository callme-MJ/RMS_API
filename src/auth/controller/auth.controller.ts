import { Controller,UseGuards, Request, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../utils/guards/local-authguards';
import { JwtAuthGuard } from '../utils/guards/jwtGuard';
import { RolesGuard } from '../utils/guards/rolesGuards';
import { Roles } from '../utils/decorator';
import { Role } from '../entities/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request()req):any {
    const user =this.authService.login(req.user);
    return user;
  }

  
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.CONTROLLER,Role.ADMIN)
  @Get('dashboard')
  getDashboard(@Request() req:any) {
    return req.user
  }
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Get('candidate/registration')
  getpage(@Request()req:any){
    return 'this is registaration page'
  }
}
