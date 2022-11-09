import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSessionController } from './controllers/admin-session.controller';
import { UserSessionController } from './controllers/user-session.controller';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  controllers: [AdminSessionController,UserSessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule { }
