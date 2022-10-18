// import {
//   TypeOrmModuleAsyncOptions,
//   TypeOrmModuleOptions,
// } from '@nestjs/typeorm';
// import { ConfigService, ConfigModule } from '@nestjs/config';

// import { Candidate } from 'src/institute/entities/candidate.entity';
// import { Institute } from 'src/institute/entities/institute.entity';

// export default class TypeOrmConfig {
//   static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
//     return {
//       type: 'mysql',
//       host: configService.get("DB_HOST"),
//       port: configService.get("DB_PORT"),
//       username: configService.get("DB_USERNAME"),
//       password: configService.get("DB_PASSWORD"),
//       database: configService.get("DB_DATABASE"),
//       entities: [Candidate,Institute],
//       synchronize: true,
//       // logging:true
//     };
//   }
// }
// export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
//   imports: [ConfigModule],
//   useFactory: async (
//     configService: ConfigService,
//   ): Promise<TypeOrmModuleAsyncOptions> => TypeOrmConfig.getOrmConfig(configService),
//   inject: [ConfigService],
// };
