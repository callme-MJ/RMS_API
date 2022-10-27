import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';

@UseGuards(AuthGuard('jwt-admin'))
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  
}
