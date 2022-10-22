import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';
import { JwtGuard } from 'src/auth/utils/guards/jwt.guard';
import { RolesGuard } from 'src/auth/utils/guards/roles.guards';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateCoordinatorDto } from '../dto/update-coordinator.dto';
import { AdminUserService } from '../services/service.user';

@Controller('admin')
@UseGuards(JwtGuard,RolesGuard)
@Roles(Role.ADMIN)
export class AdminUserController {
  constructor(private readonly adminservice: AdminUserService) {}
  
  @Post('createuser')
  create(@Body() createuserdto: CreateUserDto) {
    return this.adminservice.createUser(createuserdto);
  }

  @Get('allusers')
  findAllCoordinators() {
    return this.adminservice.findAllUsers();
  }

  @Patch('updateuser/:id')
  update(@Param('id') id: number, @Body() updateCordinDto: UpdateCoordinatorDto) {
    return this.adminservice.updateUser(id, updateCordinDto);
  }

  @Delete('deleteuser/:id')
  async remove(@Param('id') id:number) {
    console.log(id);
    return this.adminservice.removeUser(id);
  }
}
