import { Global, Module } from '@nestjs/common';
import { Session } from './entities/session.entity';
import { AdminSessionController } from './admin-session.controller';
import { SessionService } from './session.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Session])
  ],
  controllers: [AdminSessionController],
  providers: [SessionService],
  exports: [SessionService]
})
export class SessionModule { }
