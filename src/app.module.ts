import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './auth/entities/auth.entity';

@Module({
  imports: [AuthModule,
    TypeOrmModule.forRoot({
      type:'mysql',
      host:'localhost',
      port:3306,
      username:'root',
      password:'1234',
      database: 'sampledb',
      entities:[Users],
      synchronize:true
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
