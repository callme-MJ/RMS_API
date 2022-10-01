import { Controller,UseGuards, Request, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';
import { LocalAuthGuard } from '../utils/guards/local-authguards';
import { JwtAuthGuard } from '../utils/guards/jwtGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request()req):any {
    const user =this.authService.login(req.user);
    return user;
  }

  
  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getDashboard(@Request() req:any) {
    return req.user
  }

  
}
