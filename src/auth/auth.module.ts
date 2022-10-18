import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { LocalUsersStrategy } from './utils/strategies/localStrategy';
import { JwtStrategy } from './utils/strategies/jwtStrategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Coordinator } from './entities/coordinator.entity';
import { LocalCordinStrategy } from './utils/strategies/localCordinStrategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService,LocalUsersStrategy,LocalCordinStrategy,JwtStrategy],
  imports:[PassportModule,JwtModule.register({
    secret:'sec',
    signOptions:{expiresIn:'300s'},
    
  }),TypeOrmModule.forFeature([User,Coordinator])]
})
export class AuthModule {}
