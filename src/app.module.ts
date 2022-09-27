import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollegesModule } from './colleges/colleges.module';
import { candidate } from './colleges/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: '',
        password: '',
        database: '',
        entities: [candidate],
        synchronize: true,
    }),
    CollegesModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
