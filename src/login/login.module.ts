import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { AdminModule } from 'src/admin/admin.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminLoginController } from './admin/login.controller';
import { JwtAdminStrategy } from './admin/strategies/jwt-admin-strategy';
import { CoordinatorLoginController } from './coordinator/login.controller';
import { JwtCoordinatorStrategy } from './coordinator/strategies/jwt-coordinator-strategy';
import { CoordinatorModule } from 'src/coordinator/coordinator.module';
import { UserLoginController } from './user/login.controller';
import { JwtUserStrategy } from './user/strategies/user-jwt-strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    AdminModule,
    UserModule,
    CoordinatorModule,
    PassportModule.register({ defaultStrategy: 'jwt-admin', session: false }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('TTL'),
        }
      }),
      inject: [ConfigService]
    }),
  ],
  controllers: [
    LoginController,
    AdminLoginController,
    CoordinatorLoginController,
    UserLoginController
  ],
  providers: [LoginService, JwtAdminStrategy, JwtCoordinatorStrategy, JwtUserStrategy ]
})
export class LoginModule {}
