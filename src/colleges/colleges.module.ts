import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollegesController } from './controllers/college.controller';
import { CollegesService } from './services/college.service';
import { candidate } from './typeorm/entities/candidate';


@Module({
  imports:[TypeOrmModule.forFeature([candidate])],
  controllers: [CollegesController],
  providers: [CollegesService]
})
export class CollegesModule {}
