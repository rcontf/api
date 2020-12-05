import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TestModule } from './test/test.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TestModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        STEAM_API_KEY: Joi.string().trim().required(),
        JWT_SECRET: Joi.string().trim().required(),
        PORT: Joi.number().failover(8080).default(8080),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
