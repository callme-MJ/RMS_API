import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InstituteModule } from './institute/institute.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    SessionModule,InstituteModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: ["dist/**/entities/*.entity{.ts,.js}"],
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('DB_SYNC'),
        migrationsTableName: "migrations",
        migrations: ["dist/src/database/migrations/*.js"],
        cli: {
          migrationsDir: "src/database/migrations"
        },
        namingStrategy: new SnakeNamingStrategy()
      }),
      inject: [ConfigService]
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          auth: {
            user: configService.get<string>('MAIL_USERNAME'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from:
            `${configService.get<string>('MAIL_FROM_NAME')} <${configService.get<string>('MAIL_FROM_ADDRESS')}>`,
        },
        template: {
          dir: process.cwd() + "/src/templates/",
          adapter: new HandlebarsAdapter(),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD') || null,
          keyPrefix: configService.get<string>('QUEUE_KEY_PREFIX'),
        },
        defaultJobOptions: {
          removeOnComplete: true,
        }
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
