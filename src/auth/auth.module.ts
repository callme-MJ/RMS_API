import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './utils/strategies/jwtStrategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Coordinator } from './entities/coordinator.entity';
import { RtStrategy } from './utils/strategies/rtStrategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService,RtStrategy,JwtStrategy],
  imports:[PassportModule,
  JwtModule.register({secret:'sec'}),
  TypeOrmModule.forFeature([User,Coordinator])]
})
export class AuthModule {}
