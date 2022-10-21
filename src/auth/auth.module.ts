import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './utils/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Coordinator } from './entities/coordinator.entity';
import { RTStrategy } from './utils/strategies/RT.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService,RTStrategy,JwtStrategy],
  imports:[PassportModule,
  JwtModule.register({secret:'sec'}),
  TypeOrmModule.forFeature([User,Coordinator])]
})
export class AuthModule {}
