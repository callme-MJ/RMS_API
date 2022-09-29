import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollegesModule } from './colleges/colleges.module';
import { candidate } from './colleges/typeorm/entities/candidate';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '9846741707Ss',
        database: 'sibaq22db',
        entities: [candidate],
        synchronize: true,
    }),
    CollegesModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
