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

@Module({
  imports: [
    AdminModule,
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
    CoordinatorLoginController
  ],
  providers: [LoginService, JwtAdminStrategy, JwtCoordinatorStrategy ]
})
export class LoginModule {}
