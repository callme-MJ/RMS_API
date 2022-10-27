import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSessionController } from './admin-session.controller';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  controllers: [AdminSessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule { }
