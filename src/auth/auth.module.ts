import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { LocalStrategy } from './utils/strategies/localStrategy';
import { JwtStrategy } from './utils/strategies/jwtStrategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/auth.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy],
  imports:[PassportModule,JwtModule.register({
    secret:'sec',
    signOptions:{expiresIn:'300s'},
    
  }),TypeOrmModule.forFeature([Users])]
})
export class AuthModule {}
