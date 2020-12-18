import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExecuteModule } from './execute/execute.module';
import { ServersModule } from './servers/servers.module';
import { UpdateModule } from './update/update.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        STEAM_API_KEY: Joi.string().trim().required(),
        JWT_SECRET: Joi.string().trim().required(),
        PORT: Joi.number().failover(8080).default(8080),
        DATABASE_URL: Joi.string().trim().required(),
        HOST: Joi.string().default('http://localhost:3000'),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ExecuteModule,
    ServersModule,
    UpdateModule,
    LogsModule,
  ],
})
export class AppModule {}
