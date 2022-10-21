import { Module } from '@nestjs/common';
import { AdminCoordinatorService } from './services/services.coordinator';
import { AdminUserService } from './services/service.user';
import { AdminCoordinatorController } from './controllers/controller.coordinator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coordinator } from 'src/auth/entities/coordinator.entity';
import { AdminUserController } from './controllers/controller.user'
import { User } from 'src/auth/entities/users.entity';

@Module({
  controllers: [AdminCoordinatorController,AdminUserController],
  providers: [AdminCoordinatorService,AdminUserService],
  imports:[ TypeOrmModule.forFeature([Coordinator,User])]
})
export class AdminModule {}
