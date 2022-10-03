import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {  typeOrmConfigAsync } from './config/typeorm.config';
import { instituteModule } from './institute/institute.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    instituteModule,
    ConfigModule.forRoot()
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
