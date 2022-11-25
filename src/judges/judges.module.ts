import { Module } from '@nestjs/common';
import { JudgesService } from './judges.service';
import { JudgesController } from './controllers/judges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Judge } from './entities/judge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Judge]),
  ],
  controllers: [JudgesController],
  providers: [JudgesService]
})
export class JudgesModule {}
