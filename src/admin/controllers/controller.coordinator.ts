import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';
import { JwtGuard } from 'src/auth/utils/guards/jwt.guard';
import { RolesGuard } from 'src/auth/utils/guards/roles.guards';
import { AdminCoordinatorService } from '../services/services.coordinator';
import { CreateCoordinatorDto } from '../dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from '../dto/update-coordinator.dto';

@Controller('admin')
@UseGuards(JwtGuard,RolesGuard)
@Roles(Role.ADMIN)
export class AdminCoordinatorController {
  constructor(private readonly adminService: AdminCoordinatorService,) {}
  
  @Post('createcoordinator')
  create(@Body() CreateCoordinatorDto: CreateCoordinatorDto) {
    return this.adminService.create(CreateCoordinatorDto);
  }

  @Get('allcoordinators')
  findAllCoordinators() {
    return this.adminService.findAllCoordinators();
  }

  @Patch('updatecoordinator/:id')
  update(@Param('id') id: number, @Body() updateCordinDto: UpdateCoordinatorDto) {
    return this.adminService.update(id, updateCordinDto);
  }

  @Delete('deletecoordinator/:id')
  async remove(@Param('id') id:number) {
    console.log(id);
    return this.adminService.remove(id);
  }
}
