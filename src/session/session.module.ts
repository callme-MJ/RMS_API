import { Module } from '@nestjs/common';
import { Session } from './entities/session.entity';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session])
  ],
  controllers: [SessionController],
  providers: [SessionService]
})
export class SessionModule {}
